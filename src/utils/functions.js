export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Lee el archivo como Data URL (Base64)
    reader.onload = () => resolve(reader.result); // Devuelve el string Base64
    reader.onerror = (error) => reject(error);
  });
}
