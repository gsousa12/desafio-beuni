import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { create } from "zustand";
import { ProgressIndicator } from "../components/process-indicator/ProgressIndicator";
import { useFormStore } from "@/stores/auth.store";

// ========== ZOD SCHEMAS ==========
const organizationSchema = z.object({
  cnpj: z.string().min(14, "CNPJ deve ter pelo menos 14 caracteres"),
  legal_name: z.string().min(1, "Razão social é obrigatória"),
  trading_name: z.string().optional().nullable(),
});

const addressSchema = z.object({
  state: z.string().min(2, "Estado é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  street: z.string().min(1, "Rua é obrigatória"),
  zip_code: z.string().min(8, "CEP deve ter 8 dígitos"),
  number: z.string().min(1, "Número é obrigatório"),
});

const userSchema = z.object({
  full_name: z.string().min(1, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

// ========== TYPES ==========
type OrganizationFormData = z.infer<typeof organizationSchema>;
type AddressFormData = z.infer<typeof addressSchema>;
type UserFormData = z.infer<typeof userSchema>;

// ========== MAIN COMPONENT ==========
export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isCnpjLoading, setIsCnpjLoading] = useState(false);
  const [cnpjError, setCnpjError] = useState<string | null>(null);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const { organization_id, setOrganizationId, clearStore } = useFormStore();

  // Form instances for each step
  const organizationForm = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  const userForm = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  // ========== HANDLERS ==========
  const handleOrganizationSubmit = async (data: OrganizationFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3001/api/organization/", data);

      if (response.data.status === "success" && response.data.data?.[0]?.id) {
        const orgId = response.data.data[0].id;
        setOrganizationId(orgId);
        setCurrentStep(2);
      } else {
        throw new Error("Resposta inválida do servidor");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar organização");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = async (data: AddressFormData) => {
    if (!organization_id) {
      setError("ID da organização não encontrado");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...data,
        organization_id,
      };

      const response = await axios.post(
        "http://localhost:3001/api/organization/create-address",
        payload
      );

      if (response.data.status === "success") {
        setCurrentStep(3);
      } else {
        throw new Error("Resposta inválida do servidor");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar endereço");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSubmit = async (data: UserFormData) => {
    if (!organization_id) {
      setError("ID da organização não encontrado");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...data,
        organization_id,
      };

      const response = await axios.post("http://localhost:3001/api/users/", payload);

      if (response.data.status === "success") {
        setSuccess(true);
      } else {
        throw new Error("Resposta inválida do servidor");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar usuário");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    clearStore();
    setCurrentStep(1);
    setSuccess(false);
    setError(null);
    setCnpjError(null);
    setCepError(null);
    organizationForm.reset();
    addressForm.reset();
    userForm.reset();
  };

  // ========== CNPJ AUTO-COMPLETE ==========
  const fetchCnpjData = async (cnpj: string) => {
    // Remove qualquer formatação do CNPJ
    const cleanCnpj = cnpj.replace(/[^\d]/g, "");

    if (cleanCnpj.length !== 14) return;

    setIsCnpjLoading(true);
    setCnpjError(null);

    try {
      const response = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);

      if (response.data) {
        // Preenche os campos automaticamente
        organizationForm.setValue("legal_name", response.data.razao_social || "");
        organizationForm.setValue("trading_name", response.data.nome_fantasia || "");
      }
    } catch (err: any) {
      setCnpjError("CNPJ não encontrado ou inválido");
      // Limpa os campos se houver erro
      organizationForm.setValue("legal_name", "");
      organizationForm.setValue("trading_name", "");
    } finally {
      setIsCnpjLoading(false);
    }
  };

  // Debounce para consulta do CNPJ
  useEffect(() => {
    const cnpjValue = organizationForm.watch("cnpj");

    if (!cnpjValue) {
      setCnpjError(null);
      return;
    }

    const timer = setTimeout(() => {
      fetchCnpjData(cnpjValue);
    }, 1000);

    return () => clearTimeout(timer);
  }, [organizationForm.watch("cnpj")]);

  // ========== CEP AUTO-COMPLETE ==========
  const fetchCepData = async (cep: string) => {
    // Remove qualquer formatação do CEP
    const cleanCep = cep.replace(/[^\d]/g, "");

    if (cleanCep.length !== 8) return;

    setIsCepLoading(true);
    setCepError(null);

    try {
      const response = await axios.get(`https://brasilapi.com.br/api/cep/v2/${cleanCep}`);

      if (response.data) {
        // Preenche os campos automaticamente
        addressForm.setValue("state", response.data.state || "");
        addressForm.setValue("city", response.data.city || "");
        addressForm.setValue("neighborhood", response.data.neighborhood || "");
        addressForm.setValue("street", response.data.street || "");
      }
    } catch (err: any) {
      setCepError("CEP não encontrado ou inválido");
      // Limpa os campos se houver erro
      addressForm.setValue("state", "");
      addressForm.setValue("city", "");
      addressForm.setValue("neighborhood", "");
      addressForm.setValue("street", "");
    } finally {
      setIsCepLoading(false);
    }
  };

  // Debounce para consulta do CEP
  useEffect(() => {
    const cepValue = addressForm.watch("zip_code");

    if (!cepValue) {
      setCepError(null);
      return;
    }

    const timer = setTimeout(() => {
      fetchCepData(cepValue);
    }, 1000);

    return () => clearTimeout(timer);
  }, [addressForm.watch("zip_code")]);

  // ========== SUCCESS SCREEN ==========
  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Cadastro Concluído com Sucesso!
          </h2>
          <p className="text-green-600 mb-6">
            Organização, endereço e usuário admin foram criados.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Novo Cadastro
          </button>
        </div>
      </div>
    );
  }

  // ========== MAIN RENDER ==========
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Cadastro de Organização</h1>

      <ProgressIndicator currentStep={currentStep} />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">{error}</div>
      )}

      {/* STEP 1: Organization */}
      {currentStep === 1 && (
        <div className="bg-white rounded-lg shadow-md p-6 w-140">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Dados da Organização</h2>
          <form onSubmit={organizationForm.handleSubmit(handleOrganizationSubmit)}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CNPJ *
                  {isCnpjLoading && (
                    <span className="ml-2 text-orange-500 text-xs">Consultando...</span>
                  )}
                </label>
                <input
                  {...organizationForm.register("cnpj")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="00000000000000"
                />
                {organizationForm.formState.errors.cnpj && (
                  <p className="mt-1 text-sm text-red-600">
                    {organizationForm.formState.errors.cnpj.message}
                  </p>
                )}
                {cnpjError && <p className="mt-1 text-sm text-red-600">{cnpjError}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Razão Social *
                </label>
                <input
                  {...organizationForm.register("legal_name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Nome oficial da empresa"
                />
                {organizationForm.formState.errors.legal_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {organizationForm.formState.errors.legal_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Fantasia
                </label>
                <input
                  {...organizationForm.register("trading_name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Nome comercial (opcional)"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Criando..." : "Próxima Etapa"}
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: Address */}
      {currentStep === 2 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Endereço da Organização</h2>
          <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                <input
                  {...addressForm.register("state")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="SP"
                  maxLength={2}
                />
                {addressForm.formState.errors.state && (
                  <p className="mt-1 text-sm text-red-600">
                    {addressForm.formState.errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP *
                  {isCepLoading && (
                    <span className="ml-2 text-orange-500 text-xs">Consultando...</span>
                  )}
                </label>
                <input
                  {...addressForm.register("zip_code")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="00000000"
                />
                {addressForm.formState.errors.zip_code && (
                  <p className="mt-1 text-sm text-red-600">
                    {addressForm.formState.errors.zip_code.message}
                  </p>
                )}
                {cepError && <p className="mt-1 text-sm text-red-600">{cepError}</p>}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                <input
                  {...addressForm.register("city")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="São Paulo"
                />
                {addressForm.formState.errors.city && (
                  <p className="mt-1 text-sm text-red-600">
                    {addressForm.formState.errors.city.message}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                <input
                  {...addressForm.register("neighborhood")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Centro"
                />
                {addressForm.formState.errors.neighborhood && (
                  <p className="mt-1 text-sm text-red-600">
                    {addressForm.formState.errors.neighborhood.message}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rua *</label>
                <input
                  {...addressForm.register("street")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Avenida Paulista"
                />
                {addressForm.formState.errors.street && (
                  <p className="mt-1 text-sm text-red-600">
                    {addressForm.formState.errors.street.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                <input
                  {...addressForm.register("number")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="1578"
                />
                {addressForm.formState.errors.number && (
                  <p className="mt-1 text-sm text-red-600">
                    {addressForm.formState.errors.number.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Salvando..." : "Próxima Etapa"}
            </button>
          </form>
        </div>
      )}

      {/* STEP 3: User Admin */}
      {currentStep === 3 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Usuário Administrador</h2>
          <form onSubmit={userForm.handleSubmit(handleUserSubmit)}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  {...userForm.register("full_name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="João Silva"
                />
                {userForm.formState.errors.full_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {userForm.formState.errors.full_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  {...userForm.register("email")}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="admin@empresa.com"
                />
                {userForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {userForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha *</label>
                <input
                  {...userForm.register("password")}
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Mínimo 6 caracteres"
                />
                {userForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {userForm.formState.errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Finalizando..." : "Concluir Cadastro"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
