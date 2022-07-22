from flask import Flask
from flask import render_template
from flask import request
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
    #setup_sensor()
    setup_motors()
    #t = Thread(target=roda_medicao)
    #t.start()

@app.route('/',methods=['GET'])
def form():
    return render_template('form.html')

@app.route('/', methods=['POST'])
def submit():

    command=request.form['comando']
    #print("comando recebido = ", command)
    if(command == 'w'):
        move_forward(pl, pr)
    if(command == 's'):
        move_backward(pl, pr)
    if(command == 'a'):
        move_left(p)
    if(command == 'd'):
        move_right(p)
    if(command == 'x'):
        stop()
    return ('',204) 

#@app.route('/distancia', methods=['GET'])
#def distancia():
#    return str(get_distancia())

#export FLASK_DEBUG=1
if __name__ == "__main__":
    app.run(host='192.168.253.84') 
