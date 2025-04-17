import { RemoteZip } from "../lib/remote-zip";
import "./style.css";

const outputDiv = document.querySelector<HTMLDivElement>("#output")!;

document
  .querySelector<HTMLButtonElement>("#load-zip-listing")!
  .addEventListener("click", () => {
    const zipUrl =
      document.querySelector<HTMLInputElement>("#link-to-zip")!.value;
    if (!zipUrl) {
      outputDiv.textContent = "Please enter a valid ZIP URL";
    } else {
      outputDiv.textContent = "Loading ZIP listing...";
    }

    const remoteZip = new RemoteZip(zipUrl);

    remoteZip.getFileList().then((files) => {
      outputDiv.innerHTML =
        "<ul>" +
        files
          .map(
            (file) =>
              `<li>${file} <button class="download-button" type="button" data-file="${file}">Download</button></li>`
          )
          .join("\n") +
        "</ul>";
      document.querySelectorAll(".download-button").forEach((button) => {
        button.addEventListener("click", async (event) => {
          const target = event.target as HTMLElement;
          const file = target.getAttribute("data-file") as string;
          const objectURL = await remoteZip.getFileAsObjectURL(file);
          // download the file
          const link = document.createElement("a");
          link.href = objectURL;
          link.download = file.split("/").pop() || file;
          link.click();
          // invalidate the object-URL
          setTimeout(() => {
            link.remove();
            URL.revokeObjectURL(objectURL);
          }, 5000);
        });
      });
    });
  });
