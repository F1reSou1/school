'use strict';
const phoneInput = document.querySelector('#phone-photo');
const sendPhoto = document.querySelector('#send-photo');
const phoneMessage = document.querySelector('#upload-message');
const uploadToken = new URLSearchParams(location.hash.slice(1)).get('token');
let preparedPhoto = null, preparation = 0;
if (!uploadToken || !/^[A-Za-z0-9_-]{20,80}$/.test(uploadToken)) {
  phoneInput.disabled = true;
  phoneMessage.textContent = 'Ссылка неполная. Отсканируй новый QR-код на компьютере.';
}
phoneInput.addEventListener('change', async () => {
  const current = ++preparation;
  preparedPhoto = null;
  sendPhoto.disabled = true;
  document.querySelector('#phone-preview').hidden = true;
  const file = phoneInput.files[0];
  if (!file) return;
  phoneMessage.textContent = 'Подготавливаем картинку…';
  try {
    const photo = await WorkshopPhoto.prepare(file);
    if (current !== preparation) return;
    preparedPhoto = photo;
    document.querySelector('#phone-preview').src = photo;
    document.querySelector('#phone-preview').hidden = false;
    sendPhoto.disabled = false;
    phoneMessage.textContent = 'Всё готово. Нажми «Отправить в мой проект».';
  } catch (error) {
    if (current === preparation) phoneMessage.textContent = error.message;
  }
});
document.querySelector('#upload-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (!preparedPhoto || sendPhoto.disabled) return;
  sendPhoto.disabled = true;
  phoneInput.disabled = true;
  phoneMessage.textContent = 'Отправляем…';
  try {
    const response = await fetch('/api/photo-upload', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({token: uploadToken, image: preparedPhoto})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Не удалось отправить картинку.');
    document.body.dataset.success = 'true';
    phoneMessage.textContent = 'Готово! Картинка отправлена. Вернись к компьютеру — теперь можно менять её размер и положение.';
    sendPhoto.textContent = 'Отправлено ✓';
  } catch (error) {
    phoneMessage.textContent = error instanceof TypeError ? 'Нет связи. Проверь общую сеть Wi-Fi и оставь мастерскую открытой на компьютере.' : error.message;
    phoneInput.disabled = false;
    sendPhoto.disabled = false;
  }
});
