const express = require('express');
const app = express();
const router = express.Router();
const user = require('./userModel');

module.exports = router.get('/test',user.get_social_link);
module.exports = router.post('/save-contact',user.save_contact);
module.exports = router.get('/social-link',user.get_social_link);
module.exports = router.get('/get-blog/:page',user.blog);
module.exports = router.get('/get-blog-detail/:id',user.blog_detail);
module.exports = router.get('/count-blog',user.blog_count);
module.exports = router.get('/count-blog-category/:id',user.category_blog_count);
module.exports = router.get('/get-category',user.get_category);
module.exports = router.post('/count-view',user.count_view);
module.exports = router.get('/popular-blog',user.popular_blog);
module.exports = router.post('/get-tags',user.get_tag);
module.exports = router.post('/get-seo',user.get_seo);
module.exports = router.get('/get-category-blog/:id/:page',user.get_cat_blog);