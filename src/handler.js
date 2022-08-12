import { data } from './data';

const dict_word_list = data.toLowerCase().split('\n') //các từ trong data từ điển
const special_charactor = [".", ",", ";", ":", "!", "?", "'", "\"", "(", ")", "[", "]", "{", "}", "-", "_", "+", "=", "/", "\\", "*", "&", "^", "%", "$", "#", "@", "~", "`", "<", ">", "|"]
const header = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'Content-Type',
}
function splitMulti(str, tokens) { //cắt hàng loạt
  var tempChar = tokens[0];
  for (var i = 1; i < tokens.length; i++) {
    str = str.split(tokens[i]).join(tempChar);
  }
  str = str.split(tempChar);
  return str;
}
function replace_str(str, arr, newstr) { //thay thế hàng loạt
  if (!str) {
    return str;
  } else {
    for (var i = 0; i < arr.length; i++) {
      str = str.replaceAll(arr[i], newstr);
    }
  }
  return str;
}
function check_non_special_charactor(str, arr) { //kiểm tra từ xem co chứa ký tự đặc biệt hay không
  for (var i = 0; i < arr.length; i++) {
    if (str.includes(arr[i])) {
      return false;
    }
  }
  return true;
}
async function handleRequest(request) {
  const params = new URL(request.url).searchParams;
  const content = params.get('content');
  if (content === null) {
    return new Response(JSON.stringify({
      error: 'No content provided',
    }), {
      headers: header,
      status: 400
    });
  }
  const contents = splitMulti(content.toLowerCase(), [' ', '\n']);
  const content_length = contents.length;
  const filtered = contents.filter(function (n) { return n != '' });
  let result = [];
  //para_list[i].status = true; //đã check
  //para_list[i].word //tu can check
  for (let i = 0; i < filtered.length; i++) {
    if (!dict_word_list.includes(replace_str(filtered[i], special_charactor, ''))) {
      var long_word = "";
      function check(){
        for (let dodai = 2; dodai <= 4; dodai++) {
          for (let vitri = i - dodai + 1; vitri <= i; vitri++) {
            for (let index = vitri; index < vitri + dodai; index++) {
              if (!filtered[index] ||
                (index <= i && !check_non_special_charactor(filtered[index], special_charactor)) ||
                (index > i && !check_non_special_charactor(filtered[index - 1], special_charactor))
              ) {
                break;
              }
              if (filtered[index] && (
                (index <= i && check_non_special_charactor(filtered[index], special_charactor))
                ||
                (index > i && check_non_special_charactor(filtered[index - 1], special_charactor))
              )) {
                long_word += ` ${replace_str(filtered[index], special_charactor, '')}`;
              }
            }
            if (long_word.length > 0) {
              if (dict_word_list.includes(long_word.trim())) {
                return;
              }
              if (dodai == 6 && vitri == i && !dict_word_list.includes(long_word.trim())) {
                result.push(filtered[i]);
              }
            }
            long_word = "";
          }
        }
      }
      check();
    }
  }
  result = result.filter((item, index) => result.indexOf(item) === index);
  const response = new Response(JSON.stringify({
    result,
    content_length,
  }), {
    headers: {
      'Content-Type': 'application/json',
      ...header,
    },
  });
  return response;
}
export default handleRequest;