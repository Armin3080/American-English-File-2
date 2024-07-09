<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response = ['success' => false, 'files' => [], 'description' => ''];
    if (!empty($_FILES['files'])) {
        $uploadDir = 'uploads/';
        foreach ($_FILES['files']['name'] as $key => $name) {
            $tmpName = $_FILES['files']['tmp_name'][$key];
            $path = $uploadDir . basename($name);
            if (move_uploaded_file($tmpName, $path)) {
                $response['files'][] = ['url' => $path];
            } else {
                $response['description'] = 'Failed to move uploaded file.';
            }
        }
        $response['success'] = true;
    } else {
        $response['description'] = 'No files uploaded.';
    }
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
?>
