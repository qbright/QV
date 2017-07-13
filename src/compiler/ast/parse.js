/**
 * Created by zhengqiguang on 2017/6/15.
 */
var tagRE = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;

import parseTag from "./parse-tag";

var empty = Object.create ? Object.create(null) : {};

export default function (html, options) {
    options || (options = {});
    options.components || (options.components = empty);
    var result = [];
    var current;
    var level = -1;
    var arr = [];
    var byTag = {};
    var inComponent = false;

    html.replace(tagRE, function (tag, index) {
        if (inComponent) {
            if (tag !== ('</' + current.name + '>')) {
                return;
            } else {
                inComponent = false;
            }
        }
        var isOpen = tag.charAt(1) !== '/';
        var start = index + tag.length;
        var nextChar = html.charAt(start);
        var parent;

        if (isOpen) {
            level++;

            current = parseTag(tag);
            if (current.type === 'tag' && options.components[current.name]) {
                current.type = 'component';
                inComponent = true;
            }

            if (!current.voidElement && !inComponent && nextChar && nextChar !== '<') {
                let content = html.slice(start, html.indexOf('<', start));
                current.children.push({
                    type: 'text',
                    content: html.slice(start, html.indexOf('<', start)),
                    parent: current
                });
            }

            byTag[current.tagName] = current;

            // if we're at root, push new base node
            if (level === 0) {
                result.push(current);
            }

            parent = arr[level - 1];

            if (parent) {
                current.prev = parent.children[parent.children.length - 1]
                parent.children[parent.children.length - 1].next = current;
                parent.children.push(current);
                current.parent = parent;
            }

            arr[level] = current;
        }

        if (!isOpen || current.voidElement) {
            level--;
            if (!inComponent && nextChar !== '<' && nextChar) {
                // trailing text node
                arr[level].children.push({
                    type: 'text',
                    content: html.slice(start, html.indexOf('<', start)),
                    parent: arr[level]
                });
            }
        }
    });


    result = [filterEmptyDom(result[0])];


    return result;
};
//去除空的 text 节点
function filterEmptyDom($dom) {

    $dom.children = $dom.children.filter(item => {
        if (item.type === "text") {
            if (item.content.trim()) {
                return true;
            }
            return false;
        } else {

            filterEmptyDom(item);
            return true;

        }


    });

    return $dom;

}