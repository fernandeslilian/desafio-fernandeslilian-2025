/**
 * Autor: Lilian Fernandes Souza
 * 
 * Regras de adoção de animais em um abrigo.
 * 1) O animal vai para a pessoa que mostrar todos seus brinquedos favoritos na ordem desejada
 * 2) Uma pessoa pode intercalar brinquedos que o animal queira ou não, desde que estejam na ordem desejada
 * 3) Gatos não dividem seus brinquedos
 * 4) Se ambas as pessoas tiverem condições de adoção, ninguém fica com o animal (tadinho)
 * 5) Uma pessoa não pode levar mais de três animais para casa
 * 6) Loco não se importa com a ordem dos seus brinquedos desde que tenha outro animal como companhia
 */

// Dados dos animais no abrigo
const ANIMAIS_DATA = {
  'Rex': { tipo: 'cão', brinquedos: ['RATO', 'BOLA'] },
  'Mimi': { tipo: 'gato', brinquedos: ['BOLA', 'LASER'] },
  'Fofo': { tipo: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
  'Zero': { tipo: 'gato', brinquedos: ['RATO', 'BOLA'] },
  'Bola': { tipo: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
  'Bebe': { tipo: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
  'Loco': { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] }
};
/**
 * Classe que representa o abrigo de animais e suas regras de adoção.
 * - Validar animais e brinquedos
 * - Encontrar as pessoas que podem adotar os animais
 * - Decidir o destino dos animais baseado nas regras específicas de adoção
 * - Resultado final da lista formatado
 */
class AbrigoAnimais {
  /**
   * @type {Object<string, {tipo: string, brinquedos: string[]}>}
   */
  constructor() {
    this.animais = ANIMAIS_DATA;
  }
  /**
   * verifica se os animais sao válidos e não estão duplicados.
   * @param {string[]} animais lista de animais 
   * @returns 
   */
  verfAnimais(animais){
    const nomesValidos = Object.keys(this.animais);
    const nomesUnicos = new Set(animais);
    return animais.every(nome => nomesValidos.includes(nome)) && nomesUnicos.size === animais.length;
  }
  /**
   * Verifica se os brinquedos são válidos e não estão duplicados.
   * @param {string[]} brinquedos lista de brinquedos 
   * @returns 
   */
  verfBrinquedos(brinquedos){
    const brinquedosValidos = new Set(Object.values(this.animais).flatMap(a => a.brinquedos));
    const brinquedosSet = new Set(brinquedos);
    return brinquedos.every(b => brinquedosValidos.has(b)) && brinquedosSet.size === brinquedos.length;
  }
  /**
   * Verifica a condição da adoção es regras específicas para o animal Loco.
   * Loco não se importa com a ordem dos seus brinquedos desde que tenha outro animal como companhia
   * @param {string[]} resultado lista parcial de resultados 
   * @param {string[]} pessoa1 lista de brinquedos da pessoa 1 
   * @param {string[]} pessoa2 lista de brinquedos da pessoa 2
   * @param {string[]} adotadosPessoa1 animais adotados pela pessoa 1
   * @param {string[]} adotadosPessoa2 animais adotados pela pessoa 2
   * @returns 
   */
  condLoco(resultado, pessoa1, pessoa2, adotadosPessoa1, adotadosPessoa2) {
    //procura se o Loco está na lista e se ele tem companhia
    const locoIndex = resultado.findIndex(r => r.startsWith('Loco - abrigo'));
    const locoTemCompanhia = resultado.some(r => !r.startsWith('Loco - abrigo'));
    //se o Loco nao estiver na lista ou não tiver companhia, retorna
    if (locoIndex === -1 || !locoTemCompanhia) return;
    //verifica se as pessoas podem adotar o Loco
    const loco = this.animais['Loco'];
    const pessoa1Pode = loco.brinquedos.every(b => pessoa1.includes(b));
    const pessoa2Pode = loco.brinquedos.every(b => pessoa2.includes(b));
    const limite1 = this.verificaLimAdocao(adotadosPessoa1);
    const limite2 = this.verificaLimAdocao(adotadosPessoa2);
    //definindo o destino padrão
    let destino = 'abrigo';
    //verifica as condições para adoção do Loco
    if (pessoa1Pode && pessoa2Pode) {
      destino = 'abrigo';
    } else if (pessoa1Pode && limite1) {
      destino = 'pessoa 1';
      adotadosPessoa1.push('Loco');
    } else if (pessoa2Pode && limite2) {
      destino = 'pessoa 2';
      adotadosPessoa2.push('Loco');
    }
    //atualiza o resultado final do Loco
    resultado[locoIndex] = this.resultadoFinal('Loco', destino);
  }
  /**
   * Decide o destino do animal (pessoa 1, pessoa 2, abrigo) baseado nas regras de adoção.
   * @param {string} nomeAnimal nome do animal
   * @param {string[]} pessoa1 lista de brinquedos da pessoa 1
   * @param {string[]} pessoa2 lista de brinquedos da pessoa 2
   * @param {string[]} adotadosPorPessoa1 animais adotados pela pessoa 1
   * @param {string[]} adotadosPorPessoa2 animais adotados pela pessoa 2
   * @returns retorna o destino do animal (pessoa 1, pessoa 2, abrigo).
   */
  decidirDestino(nomeAnimal, pessoa1, pessoa2, adotadosPorPessoa1, adotadosPorPessoa2) {
    //pega os dados do animal
    const animal = this.animais[nomeAnimal];
    const favoritos = animal.brinquedos;
    const tipo = animal.tipo;
    // verifica critérios de adoção
    const pessoa1Pode = this.podeSerAdotado(pessoa1, favoritos, tipo);
    const pessoa2Pode = this.podeSerAdotado(pessoa2, favoritos, tipo);
    const limite1 = this.verificaLimAdocao(adotadosPorPessoa1);
    const limite2 = this.verificaLimAdocao(adotadosPorPessoa2);
    //definindo o destino padrão
    let destino = 'abrigo';
    //verifica as condições para adoção do animal
    if (pessoa1Pode && pessoa2Pode) {
      destino = 'abrigo'; // Regra 4
    } else if (pessoa1Pode && limite1) {
      destino = 'pessoa 1';
      adotadosPorPessoa1.push(nomeAnimal);
    } else if (pessoa2Pode && limite2) {
      destino = 'pessoa 2';
      adotadosPorPessoa2.push(nomeAnimal);
    }
    //retorna o destino do animal
    return destino;
  }
  /**
   * Encontra as pessoas que atendem aos requisitos para adotar os animais.
   * @param {string} brinquedosPessoa1 lista de brinquedos da pessoa 1
   * @param {string} brinquedosPessoa2 lista de brinquedos da pessoa 2
   * @param {string} ordemAnimais ordem dos animais a serem adotados
   * @returns {{lista: string[]} | { erro: string }} retorna a lista de adoções ou uma mensagem de erro
   */
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    let resultadoFinal = {};
    let erro = null;

    const pessoa1 = brinquedosPessoa1.split(',').map(b => b.trim());
    const pessoa2 = brinquedosPessoa2.split(',').map(b => b.trim());
    const animais = ordemAnimais.split(',').map(a => a.trim());

    const resultado = [];
    const adotadosPorPessoa1 = [];
    const adotadosPorPessoa2 = [];
    // validação de animais
    if (!this.verfAnimais(animais)) {
      erro = 'Animal inválido';
    }
    // validação de brinquedos
    if (!erro && !this.verfBrinquedos(pessoa1) || !this.verfBrinquedos(pessoa2)) {
      erro = 'Brinquedo inválido';
    }
    // processamento de cada animal se não houver erros
    if (!erro) {
      for (const nomeAnimal of animais) {
        //define o destino do animal
        const destino = this.decidirDestino(nomeAnimal, pessoa1, pessoa2, adotadosPorPessoa1, adotadosPorPessoa2);
        resultado.push(this.resultadoFinal(nomeAnimal, destino));
      }
      //verifica a condição especifica do Loco
      this.condLoco(resultado, pessoa1, pessoa2, adotadosPorPessoa1, adotadosPorPessoa2);
      resultado.sort((a, b) => a.localeCompare(b));
    }
    //retorna o resultado final ou o erro
    resultadoFinal = erro ? { erro } : { lista: resultado };
    return resultadoFinal;
  }
  /**
   * Verifica se a pessoa pode adotar o animal de acordo com os brinquedos favoritos e o tipo do animal.
   * @param {string[]} brinquedosPessoa lista de brinquedos da pessoa 
   * @param {string[]} favoritos lista dos brinquedos favoritos do animal 
   * @returns {boolean} retorna true se a pessoa pode adotar o animal, caso contrário retorna false.
   */
  verificaOrdemBrinquedos(brinquedosPessoa, favoritos) {
    let index = 0;
    let podeAdotar = true;
    // verifica se os brinquedos favoritos estão na ordem correta na lista de brinquedos da pessoa
    for (const brinquedo of favoritos) {
      index = brinquedosPessoa.indexOf(brinquedo, index);
      // se o brinquedo não for encontrado, a pessoa não pode adotar o animal
      if (index === -1) {
        podeAdotar = false;
        break;
      }
      index++;
    }
    //retorna a decisão final
    return podeAdotar;
  }
  /**
   * Verifica se a pessoa atingiu o limite de adoções.
   * @param {string[]} adotados lista de animais adotados pela pessoa
   * @returns {boolean} retorna true se a pessoa pode adotar mais animais, caso contrário retorna false.
   */
  verificaLimAdocao(adotados) {
    const limite = adotados.length < 3;
    return limite;
  }
  /**
   * Verifica se a pessoa pode adotar o animal.
   * @param {string[]} pessoa lista de brinquedos da pessoa
   * @param {string[]} favoritos lista dos brinquedos favoritos do animal 
   * @param {string} tipo tipo do animal (gato, cão, jabuti)
   * @return {boolean} retorna true se a pessoa pode adotar o animal, caso contrário retorna false.
   */
  podeSerAdotado(pessoa, favoritos, tipo) {
    let podeAdotar = false;
    // regras de adoção baseadas no tipo do animal
    if (tipo === 'jabuti' || tipo === 'gato') {
      // para adotar precisa ter todos os brinquedos favoritos, ordem não importa
      podeAdotar = favoritos.every(b => pessoa.includes(b));
    } else {
      // para adotar, ordem dos brinquedos importa
      podeAdotar = this.verificaOrdemBrinquedos(pessoa, favoritos);
    }
    // retorna a decisão final
    return podeAdotar;
  }
  /**
   * Fornece o resultado final da adoção.
   * @param {string} nomeAnimal nome do animal
   * @param {string} decisao decisão de adoção (pessoa 1, pessoa 2, abrigo)
   * @returns {string} retorna uma string formatada com o nome do animal e a decisão de adoção.
   */
  resultadoFinal(nomeAnimal, decisao) {
    const resultado = `${nomeAnimal} - ${decisao}`;
    return resultado;
  }
}

export { AbrigoAnimais as AbrigoAnimais };
