const canvas = document.getElementById('preview');
const fileInput = document.querySelector('input[type="file"');
const asciiImage = document.getElementById('ascii');

const context = canvas.getContext('2d');

const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;

const convertToGrayScales = (context, width, height) => {
    const imageData = context.getImageData(0, 0, width, height);

    const grayScales = [];

    for (let i = 0 ; i < imageData.data.length ; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        const grayScale = toGrayScale(r, g, b);
        imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = grayScale;

        grayScales.push(grayScale);
    }

    context.putImageData(imageData, 0, 0);

    return grayScales;
};

const MAXIMUM_WIDTH = 80;
const MAXIMUM_HEIGHT = 60;

const clampDimensions = (width, height) => {
    if (width > MAXIMUM_WIDTH) {
        return [MAXIMUM_WIDTH, height * MAXIMUM_WIDTH / width];
    }

    if (height > MAXIMUM_HEIGHT) {
        return [width * MAXIMUM_HEIGHT / height, MAXIMUM_HEIGHT];
    }

    return [width, height];
};

fileInput.onchange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
        const image = new Image();
        image.onload = () => {
            const [width, height] = clampDimensions(image.width, image.height);

            canvas.width = width;
            canvas.height = height;

            context.drawImage(image, 0, 0, width, height);
            const grayScales = convertToGrayScales(context, width, height);

            drawAscii(grayScales, width);
        }

        image.src = event.target.result;
    };

    reader.readAsDataURL(file);
};

const grayRamp = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
const rampLength = grayRamp.length;

const getCharacterForGrayScale = grayScale => grayRamp[Math.ceil((rampLength - 1) * grayScale / 255)];

const toTwoDimensionalArray = (monodimensionalArray, width) => {
    const twoDimensionsArray = [];
    for (let i = 0 ; i < monodimensionalArray.length ; i += width) {
        twoDimensionsArray.push(monodimensionalArray.slice(i, i + width));
    }

    return twoDimensionsArray;
}

const drawAscii = (grayScales, width) => {
    const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
        let nextChars = getCharacterForGrayScale(grayScale);

        if (index % width === 0) {
            nextChars += '\n';
        }

        return asciiImage + nextChars;
    }, '');

    asciiImage.textContent = ascii;
};
