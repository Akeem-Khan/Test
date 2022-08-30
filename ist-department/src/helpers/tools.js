function stripSlash(str){
    if(str.charAt(str.length-1) === '/')
        str = str.slice(0, -1);
    return str;
}

function addSlash(str){
    if(str.charAt(str.length-1) !== '/')
        str += '/';
    return str;
}

export { stripSlash, addSlash }