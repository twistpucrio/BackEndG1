import express from 'express';
import { JSONFileSync } from 'lowdb'

const router = express.Router();

// Configurar o adaptador do banco de dados
const db = new JSONFileSync('../data/products.json');

// GET /api/products - Listar todos os produtos
router.get('/', (req, res) => {
  try {
    const products = db.get('products').value();
    res.json({
      products
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar produtos' 
    });
  }
});

// GET /api/products/:id - Buscar produto por ID
router.get('/:id', (req, res) => {
  try {
    const product = db.get('products')
      .find({ id: req.params.id })
      .value();

    if (!product) {
      return res.status(404).json({ 
        error: 'Produto não encontrado' 
      });
    }

    res.json({
      product
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar produto' 
    });
  }
});

export default router;