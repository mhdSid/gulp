module.exports = function () {
	var config = {

		alljs: ["development/app/app.module.js", "development/app/app.*.js", "development/app/**/*.js"],

		allts: ["app/app.*.ts", "app/**/*.ts"],

		allless: "app/_public/styles/less/*.less",

		allcss: "development/app/_public/styles/css/*.css",

		allhtml: "app/**/*.html",

		allimg: "app/_public/img/*.*",

		allfonts: "app/_public/styles/fonts/*.*",

		buildDest: "build/app",

		buildCss: "build/app/main.css",

		buildJs: "build/app/build.js",

		build: "build/",

		browserSync: ["!app/_public/styles/less/*.less", "app/**/*.*"],

		devDest: "development/app",

		devDestCss: "development/app/_public/styles/css",

		devMainCss: "development/app/main.css",

		dev: "development/",

		fontDest: "build/app/_public/styles/fonts",

		index: "index.html",

		imgDest: "build/app/_public/img",

		templates: "build/app/templates.js"
	};
	return config;
};