from pydantic import BaseModel

class TaskSchema(BaseModel):
    title : str 
    description : str
    is_completed : bool = False 



class TaskresponseSchema(BaseModel):
    id : int
    title : str 
    description : str
    is_completed : bool  
    user_id : int| None = 0 