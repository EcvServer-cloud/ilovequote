# rh

Próxima etapa: cada documento de Recursos Humanos vive aquí como su propia
carpeta, por ejemplo:

```
rh/
└── recibo-nomina/
    ├── flow.js       // createDocFlow({ id: 'recibo-nomina', steps, emptyState })
    ├── steps/        // un componente .svelte por pantalla del flujo
    ├── template.js   // construcción del PDF con jsPDF (independiente del de cotización)
    └── schema.js      // campos específicos de este documento, compuestos con
                        // los builders genéricos de src/lib/docs/shared/schema.js
```

Aún no implementado — esta carpeta existe como parte de la infraestructura base.
