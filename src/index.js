const canvas = document.getElementById('preview');
const fileInput = document.querySelector('input[type="file"');

const context = canvas.getContext('2d');

fileInput.onchange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
        const image = new Image();
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
        }

        image.src = event.target.result;
    };

    reader.readAsDataURL(file);
};
