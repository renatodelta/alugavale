<?php
/**
 * AlugaVale - Simple Backend API
 * Stores data in a JSON file to work across multiple devices.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$db_file = 'properties.json';

// Initial data if file doesn't exist
if (!file_exists($db_file)) {
    $initial_data = [
        [
            "id" => "1",
            "ownerName" => "Ricardo Silva",
            "ownerPhone" => "5512992400019",
            "type" => "Apartamento",
            "neighborhood" => "Jardim das Nações",
            "rentValue" => "2.500,00",
            "description" => "Lindo apartamento com 2 quartos, suíte e varanda gourmet. Localização privilegiada.",
            "photos" => ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"],
            "status" => "approved",
            "createdAt" => date('c')
        ]
    ];
    file_put_contents($db_file, json_encode($initial_data, JSON_PRETTY_PRINT));
}

// Handle GET - Return all properties
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo file_get_contents($db_file);
    exit;
}

// Handle POST - Register or update properties
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON"]);
        exit;
    }

    $properties = json_decode(file_get_contents($db_file), true);

    if (isset($input['action']) && $input['action'] === 'update_status') {
        // Update existing property
        foreach ($properties as &$p) {
            if ($p['id'] === $input['id']) {
                $p['status'] = $input['status'];
                
                // Clear heavy data on rejection (as requested previously)
                if ($input['status'] === 'rejected') {
                    $p['photos'] = [];
                    $p['description'] = '--- REGISTRO REJEITADO ---';
                    $p['neighborhood'] = '---';
                    $p['rentValue'] = '0,00';
                }
                break;
            }
        }
    } else {
        // Register new property
        $new_property = $input;
        $new_property['id'] = (string)time();
        $new_property['status'] = 'pending';
        $new_property['createdAt'] = date('c');
        $properties[] = $new_property;
    }

    file_put_contents($db_file, json_encode($properties, JSON_PRETTY_PRINT));
    echo json_encode(["success" => true, "data" => $input]);
    exit;
}
?>
