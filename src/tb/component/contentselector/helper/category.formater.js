define(['jquery'], function (jquery) {

    var formatSubcontents = function (contents) {
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

    formatCategory = function (data) {
        data = data || {};
        var root = {label: "Category", children: [], isRoot: true},
            result = [];
        jquery.each(data, function (i, category) {
            category.label = category.name;
            category.isACat = true;
            category.children = formatSubcontents(category.contents);
            root.children.push(category);
        });
        result.push(root);
        return result;
    }

    return formatCategory;
});