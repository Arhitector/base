var Handlebars = require('handlebars');

module.exports = new function() {
	return {
		menuList: function (id, data, options) {
			return Handlebars.compile('{{{menuListContainer menu menuId="' + id + '"}}}', {
				noEscape: true
			})({menu: data[id].items});
		},
		menuListContainer: function (menu, options) {
			var html = '',
				id = options.hash.menuId,
				level = options.hash.levelN || 0,
				template = Handlebars.compile('{{>menu-list-item}}', {
					noEscape: true
				});

			level += 1;
			menu.forEach(function (item) {
				html += template({
					attrs: item.attributes || {},
					text: item.text,
					isLink: item.type === 'link',
					isText: item.type === 'text',
					hasSubMenu: !!item.items,
					'id': id,
					subMenu: item.items,
					'level': level
				});
			});

			return html;
		}
	};
};
