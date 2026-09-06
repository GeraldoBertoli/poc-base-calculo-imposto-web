export interface TaxCode { codigo: string; descricao: string; }
export interface Formula { id?: number; codBc: string; expressaoSpel: string; }
export interface VariableMapping { id?: number; nomeVariavel: string; operacao: string; codTrib: string; }
export interface GlobalVariable { id?: number; name: string; value: number; }
export interface AccountBalance { id?: number; conta: string; saldo: number; codTrib?: string; }
export interface CalculationAudit { id?: number; codBc: string; jsonVariaveisEntrada: string; valorResultado: number; dtProcessamento: string; }
export interface Page<T> { _embedded?: Record<string, T[]>; page?: { size: number; totalElements: number; totalPages: number; number: number }; }
