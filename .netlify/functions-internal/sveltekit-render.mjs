import { init } from '../serverless.js';

export const handler = init((() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg","Pokémon_logo.png","screenshot.png"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.D7Cod51i.js",app:"_app/immutable/entry/app.XCsw-KhA.js",imports:["_app/immutable/entry/start.D7Cod51i.js","_app/immutable/chunks/CKrZ0rUZ.js","_app/immutable/chunks/D08J4aXK.js","_app/immutable/chunks/Dg9dxuV3.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/entry/app.XCsw-KhA.js","_app/immutable/chunks/Dg9dxuV3.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/D08J4aXK.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Du09ySle.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../server/nodes/0.js')),
			__memo(() => import('../server/nodes/1.js')),
			__memo(() => import('../server/nodes/2.js')),
			__memo(() => import('../server/nodes/3.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/pokemon/[id]",
				pattern: /^\/pokemon\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})());
