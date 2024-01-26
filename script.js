document.getElementById('barcodeForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  document.getElementById('loadingIndicator').classList.remove('hidden'); // Show loader
  
  const youtubeUrl = document.getElementById('youtubeUrl').value;
  
  try {
    const response = await fetch('https://gradvids-api.vercel.app/generateBarcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ youtubeUrl })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate barcode');
    }
    
    const barcodeImageBlob = await response.blob();
    const barcodeImageUrl = URL.createObjectURL(barcodeImageBlob);
    
    const barcodeImage = new Image();
    barcodeImage.src = barcodeImageUrl;
    
    barcodeImage.onload = function() {
      document.getElementById('barcodeImageContainer').innerHTML = `
        <h3 class="text-lg font-semibold mb-2">Generated Barcode:</h3>
        <img src="${barcodeImageUrl}" alt="Generated Barcode" class="max-w-full h-auto">
      `;
      
      // Show download button
      document.getElementById('downloadButton').classList.remove('hidden');
    };
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    document.getElementById('loadingIndicator').classList.add('hidden'); // Hide loader
  }
});

document.getElementById('downloadButton').addEventListener('click', async function() {
  const barcodeImageUrl = document.querySelector('#barcodeImageContainer img').src;
  downloadImage(barcodeImageUrl);
});

function downloadImage(url) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'barcode.png';
  anchor.click();
}
