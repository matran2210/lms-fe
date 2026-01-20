import * as htmlToImage from 'html-to-image';

const useDownloadCertificate = async (html: string, name: string) => {
    const container = document.createElement('div');
    container.innerHTML = html;

    const label = container.querySelector('.label.as-label');
    if (label) {
        label.remove();
    }
    const nameField = container.querySelector<HTMLTextAreaElement>('#sapp-certificate-name');
    if (nameField) {
        nameField.innerHTML = name;
        nameField.value = name;
    }

    document.body.appendChild(container);
    const images = container.querySelectorAll("img");
    await Promise.all(
        Array.from(images).map(
            (img) =>
                new Promise<void>((resolve) => {
                    if (img.complete) resolve();
                    else img.onload = () => resolve();
                }),
        ),
    );
    htmlToImage.toPng(container).then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${name}-certificate.png`;
        link.click();
        document.body.removeChild(container);
    })
}

export default useDownloadCertificate;
