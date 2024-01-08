import sys
import numpy as np

def activation(x,):
  return 1/(1 + np.exp(-x))

def activation_deriv(x):
  return x *(1 - x)

def cost(predicted, desired):
  return np.average((desired-predicted)**2)

class NeuralNetwork() :
  def __init__ (self, inum , hnum, onum):
    self.inum = inum
    self.hnum = hnum
    self.onum = onum
    self.learning_rate = 0.0125

    self.o_weights = np.random.randn(onum,hnum)
    self.o_bias = np.zeros([onum,1])
    self.h_weights = np.random.randn(hnum,inum)
    self.h_bias = np.zeros([hnum,1])
    
    self.cost = []

  def set_params(self,  o_weights, o_bias, h_weights, h_bias):
    self.o_weights = o_weights
    self.o_bias = o_bias
    self.h_weights = h_weights
    self.h_bias = h_bias

  def train(self, inputs, desired):
    h_in = np.dot(self.h_weights, inputs) + self.h_bias
    h = activation(h_in)

    o_in = np.dot(self.o_weights, h) + self.o_bias
    predicted = activation(o_in)

    self.o_weights -= 2*(predicted-desired)*activation_deriv(predicted).dot(h.T)*self.learning_rate
    self.h_weights -= ((((2*(predicted-desired)*activation_deriv(predicted)).T.dot(self.o_weights)).T*activation_deriv(h)).dot(inputs.T))*self.learning_rate

    self.o_bias -= np.sum(2*(predicted-desired)*activation_deriv(predicted), axis=0, keepdims=True) * self.learning_rate
    self.h_bias -= np.sum(((2*(predicted-desired)*activation_deriv(predicted)).T.dot(self.o_weights)).T*activation_deriv(h), axis=0, keepdims=True) * self.learning_rate

    self.cost.append(cost(predicted, desired))
  
  def get_cost(self):
    return self.cost[len(self.cost) - 1]

  def predict(self, inputs):
    h_in = np.dot(self.h_weights, inputs) + self.h_bias
    h = activation(h_in)

    o_in = np.dot(self.o_weights, h) + self.o_bias
    predicted = activation(o_in)

    predicted = predicted.reshape(1,-1)
    predicted = predicted[0]

    max = 0
    for i in range(len(predicted)):
      if predicted[i] > predicted[max]:
        max = i

    return max

def predict():
  o_weights = np.load("./src/v2_weights/o_weights.npy")
  o_bias = np.load("./src/v2_weights/o_bias.npy")
  h_weights = np.load("./src/v2_weights/h_weights.npy")
  h_bias = np.load("./src/v2_weights/h_bias.npy")

  hnum, inum = h_weights.shape
  onum, _ = o_weights.shape

  nn2 = NeuralNetwork(inum, hnum, onum)
  nn2.set_params(o_weights, o_bias, h_weights, h_bias)


  img_array = sys.argv[1]
  img_array = list(map(float, img_array.split(',')))
  img_array = np.array(img_array)
  inputs = img_array.reshape(-1, 1)

  # print(inputs)
  predicted = nn2.predict(inputs)
  print(predicted+1)
  # print(typeof(prediction))
  # print("hi")

if __name__ == "__main__":
  predict()