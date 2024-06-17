from flask import Flask, request, render_template, app
import json
from threading import Thread

#from distancia import setup_sensor, roda_medicao, get_distancia
from controle import setup_motors, move_forward, move_backward, move_right, move_left, stop
 
app = Flask(__name__)

pl = 25 #potencia aplicada ao motor esquerdo
pr = 25 #potencia aplicada ao motor direito
p = 25  #potencia aplicad a ambos os motores quando girar a esquerda
            #ou a direita no proprio eixo.  

@app.before_first_request
def _run_on_start():
     setup_motors()
     print("start")      

@app.route('/',methods=['GET'])
def form():
    return render_template('form.html')


@app.route("/", methods=["POST"])
def receive_data():
    data = request.get_json()
    #print("DATA")
    #print(data)
    angle = data['angle']
    angle = int(data['angle'])
    x = data['xc']
    x = int(data['xc'])
    y = data['yc']
    y = int(data['yc']) 
    speed = data['speed']
    speed = int(data['speed'])
    
    pl = speed
    pr = speed
    p = speed   
    
   
    print("x = ", x, "y = ", y)
    if(45 <= angle < 135):
        move_forward(pl, pr)
    if(225 <= angle < 315):
        move_backward(pl, pr)
    if(135 <= angle < 225):
        move_left(p)
    if(angle < 45 or angle >= 315):
        move_right(p)
    if(x == 0 and y == 0):
            stop()
    return ('',204) 
    
    
#    if(0 <= angle < 80):
#        pass
#    if(80 <= angle < 100):
#        pass
#    if(100 <= angle < 180):
#        pass
#    if(180 <= angle < 260):
#        pass
#    if(260 <= angle < 280):
#        pass
#    if(280 <= angle < 


if __name__ == "__main__":
    app.run(host='192.168.3.1') 
