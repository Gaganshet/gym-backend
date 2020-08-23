/*const SERVER = "http://localhost:2020";*/
const SERVER = window.location.origin;

const jsonHeader = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export async function getRequest(url){
  const response = await window.fetch(`${SERVER}${url}`,{
    method:'GET',
    headers:jsonHeader
  });
  return await analyzeResponse(response)
}

export async function postRequest(url, param){
  const response = await window.fetch(`${SERVER}${url}`,{
    method:'POST',
    headers:jsonHeader,
    body: JSON.stringify(param)
  });
  return await analyzeResponse(response);
}

export async function putRequest(url, param){
  const response = await window.fetch(`${SERVER}${url}`,{
    method:'PUT',
    headers:jsonHeader,
    body: JSON.stringify(param)
  });
  return await analyzeResponse(response)
}

export async function deleteRequest (url, param) {
  const response = await window.fetch(`${SERVER}${url}`,{
    method:'DELETE',
    headers:jsonHeader,
    body: JSON.stringify(param)
  });
  return await analyzeResponse(response)
}

export async function postRequestCors(url, param){
  const response = await window.fetch(`${url}`,{
    method:'POST',
    headers:jsonHeader,
    body: JSON.stringify(param)
  });
  return await analyzeResponse(response);
}

export async function getRequestCors(url){
  const response = await window.fetch(`${url}`,{
    method:'GET',
    headers:jsonHeader
  });
  return await analyzeResponse(response)
}

export async function postMultiPart(url, multipart){
  const formData = buildFormData(multipart);
  const response = await window.fetch(`${SERVER}${url}`,{
    method:'POST',
    body: formData
  });
  return await analyzeResponse(response)
}

export async function postMultiPartCors(url, multipart){
  const formData = buildFormData(multipart);
  const response = await window.fetch(`${url}`,{
    method:'POST',
    body: formData
  });
  return await analyzeResponse(response)
}

export async function postAndGetMultiPartCors(url, multipart){
  const formData = buildFormData(multipart);
  const response = await window.fetch(`${url}`,{
    method:'POST',
    body: formData
  });
  return await analyzeResponse(response,"blob");
}

function buildFormData(request) {
  const formData = new FormData();
  for (const name in request) {
    formData.append(name, request[name]);
  }
  return formData;
}

const analyzeResponse = async(response, type) => {
  const { status } = response;
  let result;

  switch(type){
    case "text":
      result = await response.text();
      break;
      
    case "blob":
      result = await response.blob();
      break;

    default:
      result = await response.json();
    break;
  }
}