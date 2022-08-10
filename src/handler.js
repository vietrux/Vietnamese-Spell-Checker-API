import { data } from './data';
const header = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'Content-Type',
}
function splitMulti(str, tokens){
  var tempChar = tokens[0];
  for(var i = 1; i < tokens.length; i++){
      str = str.split(tokens[i]).join(tempChar);
  }
  str = str.split(tempChar);
  return str;
}
async function handleRequest(request) {
  const lower_words = data.toLowerCase().split('\n')
  const params = new URL(request.url).searchParams;
  const content = params.get('content');
  if(content === null){
    return new Response(JSON.stringify({
      error: 'No content provided',
    }), {
      headers: header,
      status: 400
    });
  }
  const contents = splitMulti(content.toLowerCase(), [' ', '\n', ',', '.', '?', '!', ':', ';', '"', '\'']);
  console.log(contents);
  const filtered = contents.filter(function(n){ return n != '' });
  let result = [];
  for (let i = 0; i < filtered.length; i++) {
    if(!lower_words.includes(filtered[i]) && isNaN(filtered[i])){
      result.push(filtered[i]);
    }
  }
  const response = new Response(JSON.stringify({
    result: result,
  }), {
    headers: {
      'Content-Type': 'application/json',
      ...header,
    },
  });
  return response;
}
export default handleRequest;