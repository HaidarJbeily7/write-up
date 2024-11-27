from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from ...common.dependencies import get_current_user
from ...common.config import settings
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from msrest.authentication import CognitiveServicesCredentials
import time

ocr_router = APIRouter(prefix="", tags=["ocr"])

@ocr_router.post("/extract-text")
async def extract_text(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
):
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        # Initialize Azure Computer Vision client
        subscription_key = settings.VISION_KEY
        endpoint = settings.VISION_ENDPOINT
        computervision_client = ComputerVisionClient(
            endpoint, 
            CognitiveServicesCredentials(subscription_key)
        )

        # Read file content
        contents = file.file
        print(contents)
        
        # Call Azure OCR API
        read_response = computervision_client.read_in_stream(contents, raw=True)
        print(read_response)
        # Get operation location 
        read_operation_location = read_response.headers["Operation-Location"]
        operation_id = read_operation_location.split("/")[-1]

        # Wait for results
        while True:
            read_result = computervision_client.get_read_result(operation_id)
            print(read_result)
            if read_result.status not in ['notStarted', 'running']:
                break
            time.sleep(1)

        # Process results
        extracted_text = []
        if read_result.status == OperationStatusCodes.succeeded:
            for text_result in read_result.analyze_result.read_results:
                for line in text_result.lines:
                    extracted_text.append({
                        "text": line.text,
                        "bounding_box": line.bounding_box
                    })
        # Concatenate all extracted text
        full_text = " ".join([item["text"] for item in extracted_text])
        return {
            "status": "success",
            "extracted_text": full_text
        }

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
