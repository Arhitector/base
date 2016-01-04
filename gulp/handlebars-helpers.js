var _ = require('lodash'),
	fs = require('fs'),
	handlebars = require('handlebars');

function getId() {
	global._handlebarsUniqueId = global._handlebarsUniqueId || 1;

	return 'id' + _handlebarsUniqueId++;
}

function loadJson(path) {
	var filePath = cfg.src.markups + '/' + path;

	if (filePath.indexOf('.json') === -1) {
		filePath += '.json';
	}
	return JSON.parse(fs.readFileSync(filePath));
}

function getChildData(options) {
	return handlebars.createFrame(options.data);
}

/**
 * Layouts private methods.
 */
var getStack = function (context) {
	return context.$$layoutStack || (
			context.$$layoutStack = []
		);
};

var applyStack = function (context) {
	var stack = getStack(context);

	while (stack.length) {
		stack.shift()(context);
	}
};

var getActions = function (context) {
	return context.$$layoutActions || (
			context.$$layoutActions = {}
		);
};

var getActionsByName = function (context, name) {
	var actions = getActions(context);

	return actions[name] || (
			actions[name] = []
		);
};

var applyAction = function (val, action) {
	switch (action.mode) {
		case 'append':
			return val + action.fn(this);

		case 'prepend':
			return action.fn(this) + val;

		case 'replace':
			return action.fn(this);

		default:
			return val;
	}
};

var mixin = function (target) {
	var arg,
		key,
		len = arguments.length,
		i = 1;

	for (; i < len; i++) {
		arg = arguments[i];

		if (!arg) {
			continue;
		}

		for (key in arg) {
			// istanbul ignore else
			if (arg.hasOwnProperty(key)) {
				target[key] = arg[key];
			}
		}
	}

	return target;
};

/**
 * Helpers export.
 */
module.exports = new function () {
	var helpers = _.extend({}, {
		isEnv: function (env, options) {
			return global.env && global.env === env ? options.fn(this) : options.inverse(this);
		},
		mixin: function (name, options) {
			var context = {
					id: getId()
				},
				data,
				output = '',
				template = handlebars.partials[name] || function () {
					};

			if (!_.isFunction(template)) {
				template = handlebars.compile(template);
				handlebars.partials[name] = template;
			}
			if (options.data) {
				data = getChildData(options);
				data.parent = this;
			}
			if (options.hash.path) {
				context = loadJson(options.hash.path);
				delete options.hash.path;
			}
			_.extend(context, options.hash || {});
			output = new handlebars.SafeString(template(context, {
				data: data
			}));

			return output;
		},
		contentBlock: function (options) {
		},
		json: function (path, options) {
			var obj = JSON.parse(fs.readFileSync('src/markups/' + path, {encoding: 'utf8'}));

			obj._changed = new Date();
			return obj;
		},
		uniqueId: function (options) {
			if (options.data._uniqueMaxId) {
				return options.data._uniqueMaxId;
			}
			return (options.data._uniqueMaxId = _.uniqueId('mod-'));
		},
		extend: function (name, customContext, options) {
			// Make `customContext` optional
			if (arguments.length < 3) {
				options = customContext;
				customContext = null;
			}

			options = options || {};

			var fn = options.fn || _.noop,
				context = Object.create(this || {}),
				template = handlebars.partials[name];

			// Mix custom context and hash into context
			mixin(context, customContext, options.hash);

			// Partial template required
			if (template === null) {
				throw new Error('Missing partial: \'' + name + '\'');
			}

			// Compile partial, if needed
			if (typeof template !== 'function') {
				template = handlebars.compile(template);
			}

			// Add overrides to stack
			getStack(context).push(fn);

			// Render partial
			return template(context, {
				data: getChildData(options),
				helpers: options.helpers
			});
		},
		embed: function () {
			var context = Object.create(this || {});

			// Reset context
			context.$$layoutStack = null;
			context.$$layoutActions = null;

			// Extend
			return helpers.extend.apply(context, arguments);
		},
		dump: function () {
			return '<!--' + JSON.stringify(this) + '-->';
		},
		block: function (name, options) {
			options = options || {};

			var fn = options.fn || _.noop,
				context = this || {};

			applyStack(context);

			return getActionsByName(context, name).reduce(
				applyAction.bind(context),
				fn(context)
			);
		},
		content: function (name, options) {
			options = options || {};

			var fn = options.fn,
				hash = options.hash || {},
				mode = hash.mode || 'replace',
				context = this || {};

			applyStack(context);

			// Getter
			if (!fn) {
				return name in getActions(context);
			}

			// Setter
			getActionsByName(context, name).push({
				mode: mode.toLowerCase(),
				fn: fn
			});
		}
	}, require('handlebars-helpers-ext'));

	_.each(helpers, function (func, name) {
		handlebars.registerHelper(name, func);
	});

	return helpers;
};
