/*eslint-disable*/
const productController = require('../controllers/productController');
const Product = require('../models/productModel');
const factory = require('../controllers/handlerFactory');

// Mocks para las funciones de Express (req, res, next)
const mockRequest = () => {
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();
    return { req, res, next };
  };

  describe('Product Controller', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should create a product', async () => {
      const { req, res, next } = mockRequest();
      req.body = { name: 'Test Product', price: 10, image: 'test.jpg', type: 'Desayuno' };
  
      await ProductController.createProduct(req, res, next);
  
      expect(Product.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          data: expect.any(Object),
        },
      });
    });
    it('should get a product', async () => {
        const { req, res, next } = mockRequest();
        const mockProduct = { _id: 'testId', name: 'Test Product', price: 10, image: 'test.jpg', type: 'Desayuno' };
        Product.findById = jest.fn().mockResolvedValue(mockProduct);
        req.params.id = 'testId';
    
        await ProductController.getProduct(req, res, next);
    
        expect(Product.findById).toHaveBeenCalledWith('testId');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            data: mockProduct,
          },
        });
      });
    })
  
  