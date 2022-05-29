const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
	template: "./src/index.html",
	filename: "./index.html"
});

module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.css$/,
				use: [{
					loader: "style-loader"
				},
				{
					loader: "css-loader"
				}]
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i, 
				loader: 'file-loader',
				options: {
				  name: '/src/assets/[name].[ext]'
				}
			}
		]
	},
	plugins: [htmlPlugin]
};