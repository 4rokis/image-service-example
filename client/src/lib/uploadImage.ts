const URL = `http://localhost:8080/api/upload` 

export const uploadImage = async (
  params: string,
  data: File
): Promise<string | null> => {
  const form_data = new FormData();
  form_data.append("file", data)
  return await fetch(`${URL}?${params}`, {
    method: "PUT",
    body: form_data,
  })
    .then(async (res) => {
      if (res.status >= 400) {
        console.error(`[${res.status}] ${res.statusText}`);
        return null;
      }
      return res.json();
    }).then(({ data, success }) => {
      return success ? data : null
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
};