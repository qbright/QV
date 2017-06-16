function attrString(attrs) {
    var buff = [];
    for (var key in attrs) {
        buff.push(key + '="' + attrs[key] + '"');
    }
    if (!buff.length) {
        return '';
    }
    return ' ' + buff.join(' ');
}

function getTextFn(text) {
    var regExp = /{{[ \t]*([\w\W]*?)[ \t]*}}/g;
    // console.log(3, text);
    var result = "";
    var cursor = 0;

    var $temp = "";
    while ((result = regExp.exec(text)) !== null) {
        let $temp1 = text.slice(cursor, result.index);

        $temp += wrapStaticBlock($temp1);

        $temp += wrapDynamicBlock(result);
        cursor += ($temp1.length + result[0].length);

        // console.log(result);
    }

    $temp = $temp.replace(/\+ \'$/gm, '');


    return $temp;
    // return text;
}
function getTagFn(doc) {
    console.log(doc);

    let startTag = '<' + doc.name + (doc.attrs ? attrString(doc.attrs) : '') + (doc.voidElement ? '/>' : '>'),
        endTag = '</' + doc.name + '> ';


    return {
        startTag,
        endTag
    }

}

function wrapStaticBlock(str) {
    return " + \'" + str + "\'";
}

function wrapDynamicBlock(result) {
    return " + od." + result[1] + " + '"
}


function stringify(buff, doc) {

    switch (doc.type) {
        case 'text':
            return buff + getTextFn(doc.content);
        case 'tag':
            let $t = getTagFn(doc);

            buff += $t.startTag;
            if (doc.voidElement) {
                return buff;
            }
            return buff + doc.children.reduce(stringify, '') + $t.endTag;
    }
}

export default function (doc) {
    console.log(doc);
    return doc.reduce(function (token, rootEl) {
        return token + stringify('', rootEl);
    }, '');
};
