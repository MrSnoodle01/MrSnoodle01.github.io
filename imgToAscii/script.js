const canvas = document.getElementById("preview");
const fileInput = document.querySelector('input[type="file"');
const context = canvas.getContext("2d");
// gray scale
const grayRamp = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
const rampLength = grayRamp.length;
const asciiImage = document.querySelector("pre#ascii");
var MAX_WIDTH = 80;
var MAX_HEIGHT = 50;
const fontRatio = getFontRatio();

// send user back to home page when clicking home button
document.getElementById('home-button').addEventListener('click', () =>{
    location.href = "../";
})

fileInput.onchange = e => {
    let customRows = Number(document.getElementById("customRows").value);
    let customCols = Number(document.getElementById("customCols").value);
    if(customRows > 1000){
        MAX_HEIGHT = 1000;
    }else{
        MAX_HEIGHT = customRows;
    }
    if(customCols > 1000){
        MAX_WIDTH = 1000;
    }else{
        MAX_WIDTH = customCols;
    }

    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = event => {
        const image = new Image();
        image.onload = () => {
            const [width, height] = clampDimensions(image.width, image.height);

            canvas.width = width;
            canvas.height = height;

            context.drawImage(image, 0, 0, width, height);
            const grayScales = convertToGrayScales(context, width, height);

            drawAscii(grayScales, width);
        };
        image.src = event.target.result;
    };
    reader.readAsDataURL(file);
};

// gets grayscale value, since the human eye is not equally sensitive to red, green and blue
function toGrayScale(r, g, b){
    return (0.21 * r + 0.72 * g + 0.07 * b);
}

// convert image to grayscale
function convertToGrayScales(context, width, height){
    const imageData = context.getImageData(0, 0, width, height);

    const grayScales = [];
    for(let i = 0; i < imageData.data.length; i += 4){
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        const grayScale = toGrayScale(r, g, b);
        imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = grayScale;

        grayScales.push(grayScale);
    }
    context.putImageData(imageData, 0, 0);

    return grayScales;
}

// grayscale value is a int ranging from 0(black) to 255(white)
function getCharacterForGrayScale(grayScale){
    return grayRamp[Math.ceil(((rampLength - 1) * grayScale) / 255)];
}

// draw image in ascii text
function drawAscii(grayScales, width){
    const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
        let nextChars = getCharacterForGrayScale(grayScale);

        // so that all chars arent on same line
        if((index + 1) % width == 0){
            nextChars += "\n";
        }

        return asciiImage + nextChars;
    }, "");

    asciiImage.textContent = ascii;
}

// makes image smaller
function clampDimensions(width, height){
    const rectifiedWidth = Math.floor(getFontRatio() * width);

    if(height > MAX_HEIGHT){
        const reducedWidth = Math.floor((rectifiedWidth * MAX_HEIGHT) / height);
        return [reducedWidth, MAX_HEIGHT];
    }

    if(width> MAX_WIDTH){
        const reducedHeight = Math.floor((height * MAX_WIDTH) / rectifiedWidth);
        return [MAX_WIDTH, reducedHeight];
    }

    return [rectifiedWidth, height];
}

function getFontRatio(){
    const pre = document.createElement("pre");
    pre.style.display = "inline";
    pre.textContent = " ";

    document.body.appendChild(pre);
    const {width, height} = pre.getBoundingClientRect();
    document.body.removeChild(pre);

    return height/width;
}