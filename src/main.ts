import './style.css';
import encodeQR from '@paulmillr/qr';

const app = document.querySelector<HTMLDivElement>('#app');
const formElm = document.querySelector<HTMLFormElement>('#generateForm');
const qrImgElm = document.querySelector<HTMLImageElement>('#qr');

if (app && formElm && qrImgElm) {
	formElm.onsubmit = (event) => {
		event.preventDefault();

		const formData = new FormData(formElm);

		const url = formData.get('url');
		if (typeof url !== 'string') return;

		qrImgElm.src = urlToSvgDataUrl(url);
	};
}

function urlToSvgDataUrl(url: string): string {
	const svgString = encodeQR(url, 'svg');
	const svgElement = new DOMParser().parseFromString(svgString, 'text/xml');
	const xml = new XMLSerializer().serializeToString(svgElement);
	const src = `data:image/svg+xml;charset=utf-8,${xml}`;
	return src;
}
