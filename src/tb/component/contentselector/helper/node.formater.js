define(['jquery'], function (jquery) {

    var formaterMap = {
        category: 'formatCategory',
        contenttype: 'formatContentType'
    },

    NodeFormater = {

        formatSubcontents : function (contents) {
            contents = contents || [];
            var result = [];
            jquery.each(contents, function (i, content) {
                if (content.hasOwnProperty("label") && typeof content.label === "string") {
                    content.isACat = false;
                    result.push(content);
                }
            });
            return result;
        },

        format : function (type, data) {
            var formater = formaterMap [type];

            if(typeof this[formater] !== "function") {
                throw "NodeFormaterException formater "+ formater+" doesn't exists!";
                return;
            }
            return this[formater].call(this, data);
        },

        formatCategory : function (data) {
            var self = this,
            data = data || {},
            root = {
                label: "Category",
                children: [],
                isRoot: true
            },
            result = [];
            jquery.each(data, function (i, category) {
                category.label = category.name;
                category.isACat = true;
                category.children = self.formatSubcontents(category.contents);
                root.children.push(category);
            });
            result.push(root);
            return result;
        },

        formatContentType: function (data) {
            var data = data || {},
            result = [],
            root = {
                label: "Contents",
                children: [],
                isRoot: true
            };

            jquery.each(data, function (i, content) {
               root.children.push({label : content, type: content, isACat: false });
            });

            result.push(root);
            return result;
        }
    };

    return {
        format : jquery.proxy(NodeFormater.format, NodeFormater)
    };
});