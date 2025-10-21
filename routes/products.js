const express = require('express');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

const router = express.Router();

// Inicializar o banco de dados
const db = new JsonDB(new Config('data/products', true, false, '/'));

// GET /api/products - Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const products = await db.getData('/produtos');
    res.json({produtos: products});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const products = await db.getData('/produtos');
    const product = products.find(p => p.id == req.params.id);

    if (!product) {
      return res.status(404).json({ error: `Produto ${req.params.id} não encontrado` });
    }

    res.json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

router.patch('/:id/quantidade', async (req, res) => {
    const productId = +req.params.id;
    const { nova_qtd } = req.body;

    if (nova_qtd === undefined || typeof nova_qtd !== 'number' || nova_qtd < 0) {
        return res.status(400).json({ 
            error: "Campo 'nova_qtd' inválido ou ausente. Deve ser um número não negativo." 
        });
    }

    try {
        
        const allProducts = await db.getData('/produtos');
        const productIndex = allProducts.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            return res.status(404).json({ error: `Produto com ID ${productId} não encontrado.` });
        }
        
        const productPath = `/produtos[${productIndex}]`;

        const quantidadeAnterior = allProducts[productIndex].qtd;


        await db.push(`${productPath}/qtd`, nova_qtd, true);

        allProducts[productIndex].qtd = nova_qtd;
        const produtoAtualizado = allProducts[productIndex];


        res.status(200).json({
            message: `Quantidade do produto ID ${productId} atualizada com sucesso.`,
            produto_detalhes: {
                id: produtoAtualizado.id,
                name: produtoAtualizado.name,
                qtd_anterior: quantidadeAnterior,
                qtd_nova: produtoAtualizado.qtd
            }
        });

    } catch (error) {
        console.error("Erro ao atualizar a quantidade:", error);
        res.status(500).json({ error: 'Erro interno do servidor ao atualizar a quantidade.' });
    }
});

module.exports = router;