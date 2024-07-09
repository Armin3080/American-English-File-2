document.addEventListener("DOMContentLoaded", function() {
    function addRow(file) {
        var row = document.createElement("li"),
            name = document.createElement("span");
        name.textContent = file.name;
        name.className = "file-name";
        var progressIndicator = document.createElement("span");
        progressIndicator.className = "progress-percent";
        progressIndicator.textContent = "0%";
        var progressBar = document.createElement("progress");
        progressBar.className = "file-progress";
        progressBar.setAttribute("max", "100");
        progressBar.setAttribute("value", "0");
        row.appendChild(name);
        row.appendChild(progressBar);
        row.appendChild(progressIndicator);
        document.getElementById("upload-filelist").appendChild(row);
        return row;
    }

    function handleUploadProgress(evt) {
        var xhr = evt.target,
            bar = xhr.bar,
            percentIndicator = xhr.percent;
        if (evt.lengthComputable) {
            var progressPercent = Math.floor(evt.loaded / evt.total * 100);
            bar.setAttribute("value", progressPercent);
            percentIndicator.textContent = progressPercent + "%";
        }
    }

    function handleUploadComplete(evt) {
        var xhr = evt.target,
            bar = xhr.bar,
            row = xhr.row,
            percentIndicator = xhr.percent;
        percentIndicator.style.visibility = "hidden";
        bar.style.visibility = "hidden";
        row.removeChild(bar);
        row.removeChild(percentIndicator);
        var respStatus = xhr.status,
            url = document.createElement("span");
        url.className = "file-url";
        row.appendChild(url);
        var link = document.createElement("a");
        if (200 === respStatus) {
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
                link.textContent = response.files[0].url.replace(/.*?:\/\//g, "");
                link.href = response.files[0].url;
                url.appendChild(link);
                var copy = document.createElement("button");
                copy.className = "upload-clipboard-btn";
                var glyph = document.createElement("img");
                glyph.src = "img/glyphicons-512-copy.png";
                copy.appendChild(glyph);
                url.appendChild(copy);
                copy.addEventListener("click", function(event) {
                    var element = document.createElement("a");
                    element.textContent = response.files[0].url;
                    link.appendChild(element);
                    var range = document.createRange();
                    range.selectNode(element);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                    document.execCommand("copy");
                    link.removeChild(element);
                });
            } else bar.innerHTML = "Error: " + response.description;
        } else 413 === respStatus ? (link.textContent = "File too big!", url.appendChild(link)) : (link.textContent = "Server error!", url.appendChild(link));
    }

    function uploadFile(file, row) {
        var bar = row.querySelector(".file-progress"),
            percentIndicator = row.querySelector(".progress-percent"),
            xhr = new XMLHttpRequest;
        xhr.open("POST", "upload.php");
        xhr.row = row;
        xhr.bar = bar;
        xhr.percent = percentIndicator;
        xhr.upload.bar = bar;
        xhr.upload.percent = percentIndicator;
        xhr.addEventListener("load", handleUploadComplete, !1);
        xhr.upload.onprogress = handleUploadProgress;
        var auth = "Basic ";
        auth += document.getElementById("username").value;
        auth += ":";
        auth += document.getElementById("password").value;
        var form = new FormData;
        form.append("files[]", file);
        form.append("HTTP_AUTHORIZATION", auth);
        xhr.send(form);
    }

    function stopDefaultEvent(evt) {
        evt.stopPropagation();
        evt.preventDefault();
    }

    function handleDragAway(state, element, evt) {
        stopDefaultEvent(evt);
        state.dragCount -= 1;
        0 == state.dragCount && (element.textContent = "Select or drop file(s)");
    }

    var state = { dragCount: 0 },
        uploadButton = document.getElementById("upload-btn");
    window.addEventListener("dragenter", function handleDrag(state, element, evt) {
        stopDefaultEvent(evt);
        1 == state.dragCount && (element.textContent = "Drop it here~");
        state.dragCount += 1;
    }.bind(this, state, uploadButton), !1);
    window.addEventListener("dragleave", handleDragAway.bind(this, state, uploadButton), !1);
    window.addEventListener("drop", handleDragAway.bind(this, state, uploadButton), !1);
    window.addEventListener("dragover", stopDefaultEvent, !1);
    var uploadInput = document.getElementById("upload-input");
    uploadInput.addEventListener("change", function uploadFiles(evt) {
        for (var len = evt.target.files.length, i = 0; i < len; i++) {
            var file = evt.target.files[i];
            uploadFile(file, addRow(file));
        }
    });
    uploadButton.addEventListener("click", function selectFiles(target, evt) {
        stopDefaultEvent(evt);
        target.click();
    }.bind(this, uploadInput));
    uploadButton.addEventListener("drop", function handleDragDrop(state, element, evt) {
        stopDefaultEvent(evt);
        handleDragAway(state, element, evt);
        for (var len = evt.dataTransfer.files.length, i = 0; i < len; i++) {
            var file = evt.dataTransfer.files[i];
            uploadFile(file, addRow(file));
        }
    }.bind(this, state, uploadButton), !1);
    document.getElementById("upload-form").classList.add("js");
});
