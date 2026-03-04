from typing import Optional
from pydantic import BaseModel

class StatusResponse(BaseModel):
    people: int
    faces: int
    occupied: bool
    appliance_on: bool
    waste_detected: bool
    brightness: int
    latency: float

class MetricsResponse(BaseModel):
    precision: float
    recall: float
    f1_score: float
    false_trigger_rate: float


class StatusIngest(BaseModel):
    people: Optional[int] = None
    faces: Optional[int] = None
    occupied: Optional[bool] = None
    appliance_on: Optional[bool] = None
    waste_detected: Optional[bool] = None
    brightness: Optional[int] = None
    latency: Optional[float] = None


class MetricsIngest(BaseModel):
    precision: Optional[float] = None
    recall: Optional[float] = None
    f1_score: Optional[float] = None
    false_trigger_rate: Optional[float] = None


class IngestPayload(BaseModel):
    status: Optional[StatusIngest] = None
    metrics: Optional[MetricsIngest] = None
