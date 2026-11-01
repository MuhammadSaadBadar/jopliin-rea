"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("@joplin/utils/path");
const esbuild = __importStar(require("esbuild"));
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_2 = require("path");
const baseDir = (0, path_2.dirname)(__dirname);
const baseNodeModules = (0, path_2.join)(baseDir, 'node_modules');
// Note: Roughly based on js-draw's use of esbuild:
// https://github.com/personalizedrefrigerator/js-draw/blob/6fe6d6821402a08a8d17f15a8f48d95e5d7b084f/packages/build-tool/src/BundledFile.ts#L64
const makeBuildContext = (entryPoint, renderer, addDebugStats) => {
    return esbuild.context({
        entryPoints: [entryPoint],
        outfile: `${(0, path_1.filename)(entryPoint)}.bundle.js`,
        bundle: true,
        minify: true,
        keepNames: true, // Preserve original function names -- useful for debugging
        format: 'iife', // Immediately invoked function expression
        sourcemap: true,
        sourcesContent: false, // Do not embed full source file content in the .map file
        metafile: addDebugStats,
        platform: 'node',
        target: ['node20.0'],
        mainFields: renderer ? ['browser', 'main'] : ['main'],
        plugins: [
            {
                // Configures ESBuild to require(...) certain libraries that cause issues if included directly
                // in the bundle. Some of these are transitive dependencies and so need to have relative paths
                // in the final bundle.
                name: 'joplin--relative-imports-for-externals',
                setup: build => {
                    const externalRegex = /^(.*\.node|sqlite3|node-fetch|electron|@electron\/remote\/.*|electron\/.*|@mapbox\/node-pre-gyp|jsdom|onnxruntime-node|@xenova\/transformers)$/;
                    build.onResolve({ filter: externalRegex }, args => {
                        // Electron packages don't need relative requires
                        if (args.path === 'electron' || args.path.startsWith('electron/')) {
                            return { path: args.path, external: true, namespace: 'node' };
                        }
                        // Other packages may need relative requires
                        let path = (0, path_1.toForwardSlashes)((0, path_2.relative)(baseDir, require.resolve(args.path, { paths: [baseNodeModules, args.resolveDir, baseDir] })));
                        if (!path.startsWith('.')) {
                            path = `./${path}`;
                        }
                        // Some files have .node.* extensions but are not native modules. These files are often required using
                        // require('./something.node') rather than require('./something.node.js'). Skip path remapping for
                        // these files:
                        if (args.path.endsWith('.node') && (path.endsWith('.ts') || path.endsWith('.js'))) {
                            // Normal .ts or .js file -- continue.
                            return null;
                        }
                        // Log that this is external -- it should be included in "dependencies" and not "devDependencies" in package.json:
                        console.log('External path:', path, args.importer);
                        return {
                            path,
                            external: true,
                        };
                    });
                },
            },
            {
                // Rewrite imports to prefer .js files to .ts. Otherwise, certain files are duplicated in the final bundle
                name: 'joplin--prefer-js-imports',
                setup: build => {
                    // Rewrite all relative imports
                    build.onResolve({ filter: /^\./ }, args => {
                        try {
                            const importPath = args.path === '.' ? './index' : args.path;
                            let path = require.resolve(importPath, { paths: [args.resolveDir, baseNodeModules, baseDir] });
                            // require.resolve **can** return paths with .ts extensions, presumably because
                            // this build script is a .ts file.
                            if (path.endsWith('.ts')) {
                                const alternative = path.replace(/\.ts$/, '.js');
                                if ((0, fs_1.existsSync)(alternative)) {
                                    path = alternative;
                                }
                            }
                            return { path };
                        }
                        catch (error) {
                            return {
                                errors: [{ text: `Failed to import: ${error}`, detail: error }],
                            };
                        }
                    });
                },
            },
            {
                name: 'joplin--smaller-source-map-size',
                setup: build => {
                    // Unless bundling with additional debug information, exclude 3rd-party
                    // dependencies from source maps. This significantly reduces the size of the
                    // source map, improving startup performance.
                    //
                    // See https://github.com/evanw/esbuild/issues/1685#issuecomment-944916409
                    // and https://github.com/evanw/esbuild/issues/4130
                    if (!addDebugStats) {
                        const emptyMapData = Buffer.from(JSON.stringify({ version: 3, sources: [null], mappings: 'AAAA' }), 'utf-8').toString('base64');
                        const emptyMapUrl = `data:application/json;base64,${emptyMapData}`;
                        build.onLoad({ filter: /node_modules.*js$/ }, args => {
                            return {
                                contents: [
                                    (0, fs_1.readFileSync)(args.path, 'utf8'),
                                    `//# sourceMappingURL=${emptyMapUrl}`,
                                ].join('\n'),
                                loader: 'default',
                            };
                        });
                    }
                },
            },
        ],
    });
};
const bundleJs = async (writeStats) => {
    const entryPoints = [
        { fileName: 'main.ts', renderer: false },
        { fileName: 'main-html.ts', renderer: true },
    ];
    for (const { fileName, renderer } of entryPoints) {
        const compiler = await makeBuildContext(fileName, renderer, writeStats);
        const result = await compiler.rebuild();
        if (writeStats) {
            const outPath = `${(0, path_2.dirname)(__dirname)}/${fileName}.meta.json`;
            console.log('Writing bundle stats to ', outPath);
            await (0, promises_1.writeFile)(outPath, JSON.stringify(result.metafile, undefined, '\t'));
        }
        await compiler.dispose();
    }
};
exports.default = bundleJs;
//# sourceMappingURL=bundleJs.js.map