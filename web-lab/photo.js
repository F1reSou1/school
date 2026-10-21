/* Shared by the workshop and the phone upload page. No external services. */
window.WorkshopPhoto = {
  async prepare(file) {
    if (!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)) {
      throw new Error('Выбери JPG, PNG, WebP или GIF. Если фото в HEIC, сохрани его как JPG.');
    }
    if (file.size > 20 * 1024 * 1024) throw new Error('Фото слишком большое. Выбери файл до 20 МБ.');
    const url = URL.createObjectURL(file), image = new Image();
    try {
      image.src = url;
      await image.decode();
      const scale = Math.min(1, 960 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      for (const quality of [0.82, 0.65, 0.45, 0.25]) {
        const result = canvas.toDataURL('image/jpeg', quality);
        if (result.length <= 220000) return result;
      }
      throw new Error('Не удалось уменьшить фото. Выбери изображение поменьше.');
    } catch (error) {
      if (error.name === 'EncodingError') throw new Error('Браузер не смог прочитать фото. Попробуй JPG или PNG.');
      throw error;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
};
