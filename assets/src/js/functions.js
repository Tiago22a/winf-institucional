 // Mensagem de boas-vindas desaparece após 4s
    window.addEventListener('DOMContentLoaded', () => {
      const msg = document.getElementById('welcomeMessage');
      setTimeout(() => {
        msg.style.opacity = '0';
        msg.style.transition = 'opacity 0.5s ease';
      }, 4000);
    });

    // Gerar QR Code
    document.getElementById('generateQRBtn').addEventListener('click', () => {
      const qrContainer = document.getElementById('qrcode');
      qrContainer.innerHTML = '';

      const input = document.getElementById('qrInput').value.trim();
      if (!input) return;

      const qr = new QRious({
        element: document.createElement('canvas'),
        value: input,
        size: 200,
      });

      qrContainer.appendChild(qr.element);

      const downloadBtn = document.createElement('a');
      downloadBtn.download = 'qrcode.png';
      downloadBtn.href = qr.element.toDataURL();
      downloadBtn.textContent = 'Baixar QR Code';
      downloadBtn.className = 'mt-2 inline-block bg-gray-800 text-white px-4 py-1 rounded hover:bg-gray-900';
      qrContainer.appendChild(downloadBtn);
    });