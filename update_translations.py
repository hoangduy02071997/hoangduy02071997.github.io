import json

with open("assets/js/main.js", "r") as f:
    content = f.read()

# We can append this to the end of main.js since translations is a const object
# and we can simply use Object.assign(translations.vi, {...})
# wait, translations is declared with const but its properties can be mutated!

append_str = """

// --- Timeline Translations ---
if (translations.vi) Object.assign(translations.vi, {
  "Maintenance and development of internal systems including ERP, SmartCard and Ecommerce.": "Bảo trì và phát triển hệ thống nội bộ bao gồm ERP, SmartCard và Ecommerce.",
  "Built and maintained HTOfficial POS for stock, product variants, materials, orders, accounting and tax invoice publishing.": "Xây dựng và bảo trì HTOfficial POS cho kho, biến thể sản phẩm, đơn hàng, kế toán và xuất hoá đơn thuế.",
  "Researched improvements to business flows and handled customer maintenance.": "Nghiên cứu cải tiến luồng nghiệp vụ và hỗ trợ khách hàng.",
  "Node.js backend development and new features from business requirements.": "Phát triển Node.js backend và tính năng mới từ yêu cầu nghiệp vụ.",
  "Maintenance, change requests and enhancement of features following business rules.": "Bảo trì, xử lý yêu cầu thay đổi và cải tiến tính năng theo quy tắc nghiệp vụ.",
  "RESTful APIs for mobile and SPA applications.": "Phát triển RESTful APIs cho ứng dụng di động và SPA.",
  "SQL query optimization and backend development across activation and ecommerce systems.": "Tối ưu truy vấn SQL và phát triển backend cho các hệ thống Activation, Ecommerce.",
  "Backend CMS for CRUD data and RESTful APIs for SPA CMS and websites.": "Phát triển Backend CMS xử lý dữ liệu CRUD và RESTful APIs cho SPA, Websites.",
  "Frontend team lead, backend and mobile development, project management and technical support for customers.": "Lead Frontend, phát triển Backend, Mobile, quản lý dự án và hỗ trợ kỹ thuật.",
  "Frontend website development, backend development and customer technology support.": "Phát triển website Frontend, Backend và hỗ trợ kỹ thuật khách hàng.",
  "Frontend and backend website development and product/solution development.": "Phát triển website Frontend, Backend và giải pháp sản phẩm.",
  "Managed company devices and network and provided hosting for development environments including Dev, Staging and UAT.": "Quản lý thiết bị/mạng nội bộ và quản trị máy chủ cho môi trường Dev, Staging, UAT.",
  "TOEIC 550": "Chứng chỉ TOEIC 550",
  "MCSA (Microsoft Certified Solutions Associate)": "Chứng chỉ Quản trị Hệ thống Microsoft (MCSA)"
});

if (translations.ja) Object.assign(translations.ja, {
  "Maintenance and development of internal systems including ERP, SmartCard and Ecommerce.": "ERP、SmartCard、Ecommerceを含む社内システムの保守・開発。",
  "Built and maintained HTOfficial POS for stock, product variants, materials, orders, accounting and tax invoice publishing.": "在庫、製品、注文、会計、税金請求書発行のためのHTOfficial POSを構築・保守。",
  "Researched improvements to business flows and handled customer maintenance.": "ビジネスフローの改善を調査し、顧客対応を実施。",
  "Node.js backend development and new features from business requirements.": "ビジネス要件に基づくNode.jsバックエンドおよび新機能の開発。",
  "Maintenance, change requests and enhancement of features following business rules.": "ビジネスルールに基づく保守、変更要求、および機能強化。",
  "RESTful APIs for mobile and SPA applications.": "モバイルおよびSPAアプリケーション向けのRESTful API開発。",
  "SQL query optimization and backend development across activation and ecommerce systems.": "アクティベーションおよびECシステム全体のSQLクエリ最適化とバックエンド開発。",
  "Backend CMS for CRUD data and RESTful APIs for SPA CMS and websites.": "CRUDデータ用バックエンドCMS、およびSPAやWeb向けRESTful API開発。",
  "Frontend team lead, backend and mobile development, project management and technical support for customers.": "フロントエンドリード、バックエンド・モバイル開発、プロジェクト管理、技術サポート。",
  "Frontend website development, backend development and customer technology support.": "フロントエンドWeb開発、バックエンド開発、顧客技術サポート。",
  "Frontend and backend website development and product/solution development.": "フロントエンド・バックエンドWeb開発、製品・ソリューション開発。",
  "Managed company devices and network and provided hosting for development environments including Dev, Staging and UAT.": "社内デバイスとネットワークの管理、開発環境（Dev、Staging、UAT）のホスティング提供。",
  "TOEIC 550": "TOEIC 550",
  "MCSA (Microsoft Certified Solutions Associate)": "MCSA (Microsoft Certified Solutions Associate)"
});

if (translations.zh) Object.assign(translations.zh, {
  "Maintenance and development of internal systems including ERP, SmartCard and Ecommerce.": "维护和开发包括ERP、SmartCard和电子商务在内的内部系统。",
  "Built and maintained HTOfficial POS for stock, product variants, materials, orders, accounting and tax invoice publishing.": "构建和维护HTOfficial POS，用于库存、产品、订单、会计和税务发票。",
  "Researched improvements to business flows and handled customer maintenance.": "研究业务流程改进并处理客户维护。",
  "Node.js backend development and new features from business requirements.": "根据业务需求开发Node.js后端和新功能。",
  "Maintenance, change requests and enhancement of features following business rules.": "遵循业务规则进行维护、变更请求和功能增强。",
  "RESTful APIs for mobile and SPA applications.": "为移动端和SPA应用开发RESTful API。",
  "SQL query optimization and backend development across activation and ecommerce systems.": "针对激活和电子商务系统进行SQL查询优化和后端开发。",
  "Backend CMS for CRUD data and RESTful APIs for SPA CMS and websites.": "用于CRUD数据的后端CMS，以及用于SPA和网站的RESTful API。",
  "Frontend team lead, backend and mobile development, project management and technical support for customers.": "前端组长、后端和移动端开发、项目管理和客户技术支持。",
  "Frontend website development, backend development and customer technology support.": "前端网站开发、后端开发和客户技术支持。",
  "Frontend and backend website development and product/solution development.": "前端和后端网站开发及产品/解决方案开发。",
  "Managed company devices and network and provided hosting for development environments including Dev, Staging and UAT.": "管理公司设备和网络，为开发、测试和UAT环境提供托管。",
  "TOEIC 550": "TOEIC 550",
  "MCSA (Microsoft Certified Solutions Associate)": "微软认证解决方案副专家 (MCSA)"
});

if (translations.ru) Object.assign(translations.ru, {
  "Maintenance and development of internal systems including ERP, SmartCard and Ecommerce.": "Поддержка и разработка внутренних систем, включая ERP, SmartCard и Ecommerce.",
  "Built and maintained HTOfficial POS for stock, product variants, materials, orders, accounting and tax invoice publishing.": "Создание и поддержка HTOfficial POS для складов, товаров, заказов, учета и выставления счетов.",
  "Researched improvements to business flows and handled customer maintenance.": "Исследование улучшений бизнес-процессов и поддержка клиентов.",
  "Node.js backend development and new features from business requirements.": "Разработка бэкенда на Node.js и новых функций по бизнес-требованиям.",
  "Maintenance, change requests and enhancement of features following business rules.": "Поддержка, запросы на изменения и улучшение функций в соответствии с бизнес-правилами.",
  "RESTful APIs for mobile and SPA applications.": "Разработка RESTful API для мобильных и SPA приложений.",
  "SQL query optimization and backend development across activation and ecommerce systems.": "Оптимизация SQL-запросов и разработка бэкенда для систем активации и электронной коммерции.",
  "Backend CMS for CRUD data and RESTful APIs for SPA CMS and websites.": "Backend CMS для данных CRUD и RESTful API для SPA и веб-сайтов.",
  "Frontend team lead, backend and mobile development, project management and technical support for customers.": "Руководитель frontend команды, разработка бэкенда/мобильных приложений, управление проектами.",
  "Frontend website development, backend development and customer technology support.": "Разработка frontend, backend и техническая поддержка клиентов.",
  "Frontend and backend website development and product/solution development.": "Разработка frontend/backend и продуктов/решений.",
  "Managed company devices and network and provided hosting for development environments including Dev, Staging and UAT.": "Управление устройствами и сетью компании, предоставление хостинга для Dev, Staging и UAT.",
  "TOEIC 550": "TOEIC 550",
  "MCSA (Microsoft Certified Solutions Associate)": "MCSA (Microsoft Certified Solutions Associate)"
});
"""

with open("assets/js/main.js", "a") as f:
    f.write(append_str)

print("Done appending translations!")
