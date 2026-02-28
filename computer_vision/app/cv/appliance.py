# app/cv/appliance.py
"""
Appliance state detection using brightness heuristics.
"""

import cv2

def detect_appliance(frame, threshold=120):

    # Convert to grayscale for brightness calculation
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Calculate average brightness
    brightness = gray.mean()

    # Determine appliance state
    appliance_on = brightness > threshold

    return appliance_on, brightness