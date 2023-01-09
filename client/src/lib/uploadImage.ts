export const uploadImage = async (
  params: string,
  data: File
): Promise<boolean> => {
  const form_data = new FormData();
  form_data.append("file", data)
  return await fetch(`http://localhost:8080/api/upload?${params}`, {
    method: "PUT",
    body: form_data,
  })
    .then(async (res) => {
      if (res.status >= 400) {
        console.error(`[${res.status}] ${res.statusText}`);
        return false;
      }
      return true;
    })
    .catch((e) => {
      console.error(e);
      return false;
    });
};