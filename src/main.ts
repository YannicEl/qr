import './style.css';
import encodeQR from '@paulmillr/qr';

const formElm = document.querySelector<HTMLFormElement>('#generateForm')!;
const qrImgElm = document.querySelector<HTMLImageElement>('#qrImg')!;
const donwloadButtonsElm = document.querySelector<HTMLImageElement>('#downloadButtons')!;

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;

formElm.onsubmit = async (event) => {
	event.preventDefault();

	const formData = new FormData(formElm);

	const url = formData.get('url');
	if (typeof url !== 'string') return;

	qrImgElm.src = await urlToSvgDataUrl(url);
	qrImgElm.style.display = 'block';
	donwloadButtonsElm.style.opacity = '1';
};

const svgDownloadButtonElm = document.querySelector<HTMLButtonElement>('#svgDownload')!;
svgDownloadButtonElm.onclick = (event) => {
	event.preventDefault();
	downloadAsSvg();
};

function downloadAsSvg() {
	downloadFile(qrImgElm.src, 'qr.svg');
}

const pngDownloadButtonElm = document.querySelector<HTMLButtonElement>('#pngDownload')!;
pngDownloadButtonElm.onclick = (event) => {
	event.preventDefault();
	downloadAsPng();
};

function downloadAsPng() {
	const canvas = document.createElement('canvas');
	canvas.width = 3000;
	canvas.height = 3000;
	const ctx = canvas.getContext('2d')!;
	ctx.drawImage(qrImgElm, 0, 0, 3000, 3000);

	const dataUri = canvas.toDataURL('image/png');
	downloadFile(dataUri, 'qr.png');
}

function downloadFile(dataUri: string, filename: string) {
	const link = document.createElement('a');
	link.download = filename;
	link.href = dataUri;

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

async function urlToSvgDataUrl(url: string): Promise<string> {
	const svgString = encodeQR(url, 'svg', {
		border: 0,
	});
	const svgElement = new DOMParser().parseFromString(svgString, 'text/xml');
	const xml = new XMLSerializer().serializeToString(svgElement);
	const src = `data:image/svg+xml;charset=utf-8,${xml}`;
	return src;
}
