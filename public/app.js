const photoInput =
    document.getElementById("photoInput");

const preview =
    document.getElementById("preview");

const uploadButton =
    document.getElementById("uploadButton");

const status =
    document.getElementById("status");

const progressContainer =
    document.getElementById("progressContainer");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

let selectedFiles = [];

photoInput.addEventListener("change", () => {

    selectedFiles =
        Array.from(photoInput.files);

    preview.innerHTML = "";

    selectedFiles.forEach(file => {

        const image =
            document.createElement("img");

        image.className =
            "preview-image";

        image.src =
            URL.createObjectURL(file);

        preview.appendChild(image);
    });

    uploadButton.disabled =
        selectedFiles.length === 0;

    status.textContent =
        selectedFiles.length > 0
            ? `${selectedFiles.length} photo(s) selected`
            : "";
});


uploadButton.addEventListener("click", () => {

    if (selectedFiles.length === 0) {
        return;
    }

    const formData =
        new FormData();

    selectedFiles.forEach(file => {
        formData.append(
            "photos",
            file
        );
    });

    const xhr =
        new XMLHttpRequest();

    xhr.open(
        "POST",
        "/dropsend/upload"
    );

    progressContainer.classList.remove(
        "hidden"
    );

    uploadButton.disabled = true;

    progressBar.style.width = "0%";

    progressText.textContent =
        "Uploading...";

    xhr.upload.addEventListener(
        "progress",
        event => {

            if (!event.lengthComputable) {
                return;
            }

            const percent =
                Math.round(
                    (event.loaded /
                        event.total) *
                    100
                );

            progressBar.style.width =
                `${percent}%`;

            progressText.textContent =
                `Uploading ${percent}%`;
        }
    );

    xhr.addEventListener(
        "load",
        () => {

            if (
                xhr.status >= 200 &&
                xhr.status < 300
            ) {

                const result =
                    JSON.parse(xhr.responseText);

                status.textContent =
                    `✓ ${result.count} photo(s) transferred`;

                progressBar.style.width =
                    "100%";

                progressText.textContent =
                    "Upload complete";

                selectedFiles = [];

                photoInput.value = "";

                preview.innerHTML = "";

            } else {

                status.textContent =
                    "Upload failed";

            }

            uploadButton.disabled =
                true;
        }
    );

    xhr.addEventListener(
        "error",
        () => {

            status.textContent =
                "Network error";

            uploadButton.disabled =
                false;
        }
    );

    xhr.send(formData);
});
