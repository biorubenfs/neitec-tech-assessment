# Technical Report

## Arquitectura y Framework

Se optó por emplear NestJS como framework, ya que aunque actualmente no trabajo con ello, estoy aprendiéndolo, por lo que tenía listo un esqueleto de proyecto que me ahorró algo de tiempo inicial. De esta forma, además de resultar útil para la prueba técnica el proyecto me ha resultado útil en mi aprendizaje sobre NestJs

Se optó por emplear una base de datos NoSQL como Mongodb ya que es la que permitía desarrollar el proyecto de forma más rápida por tener más experiencia con ello.

La arquitectura empleada es la definida por defecto por NestJS, basada en módulos, controlladores y servicios.

Se ha incorporad CI con las fases de `build`, `lint` y `test`.

## Técnica de Prompting
Estrategias aplicadas:

**Role prompting**: se indica al modelo que actúe como analista financiero.

**Instruction prompting**: se detallan las tareas (extraer nombre de la empresa, calcular ratios).

**Output formatting**: se obliga al modelo a devolver un JSON con claves específicas.

**Error handling prompting**: se añade un campo "notes" para aclaraciones o incertidumbres.

## Limitaciones conocidas

### En la aplicación

- Añadir tests de integración: En mi opinión son los más útiles cuando se desea probar un API REST, pero también los más dificiles de implementar en cuanto que hacerlos requiere una base de datos en memoria, que en mi experiencia son complejar de gestionar.

### En los clientes de IA
La técnica de prompting es el aspecto que creo que más se puede mejorar. Por cuestiones de tiempo no he podido investigar lo suficiente sobre ello para aplicar un *function calling* (https://ai.google.dev/gemini-api/docs/function-calling?example=meeting) que asegure la consistencia de la salida devuelta por el cliente de IA y que facilite la integración con el backend. Creo que lo ideal hubiera sido definir algo así:

```javascript
const response = await this.client.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: contents,
  config: {
    tools: [
      {
        functionDeclarations: [{
          "name": "analyze_financial_report",
          "parameters": {
            "type": Type.OBJECT,
            "properties": {
              "company": { type: Type.STRING },
              "currentRatio": { "type": Type.NUMBER },
              "debtRatio": { "type": Type.NUMBER },
              "netProfitMargin": { "type": Type.NUMBER },
              "notes": { "type": Type.STRING }
            },
            "required": ["company", "currentRatio", "debtRatio", "netProfitMargin"]
          },
        }]
      }
    ]
  }
});
```

Evitando tener que hacerlo en el prompt directamente y eliminando el parseo de datos para adaptarlo a una estructura tipo `json` que se pueda guardar directamente en base de datos. De hecho una de las limitaciones que he notado es que a pesar de dar instrucciones precisas de que no devuelva el texto envuelto en formato *markdown*, el agente de IA ignora esta instrucción (al menos con el modelo probado hasta ahora).

Otra posible mejora sería poder parametrizar el modelo a usar en cada cliente de IA.

