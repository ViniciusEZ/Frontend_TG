<template>
  <SimpleNavbar />
    <div class="register-container">
   
      <v-container class="d-flex justify-center align-center fill-height">
        <v-card class="pa-6" max-width="800" width="700">
          <v-card-title class="headline text-center">Criar Conta</v-card-title>
          <v-card-text>
            <v-form ref="registerForm" @submit.prevent="handleRegister">
              <v-text-field
                v-model="formData.name"
                label="Nome Completo"
                required
                :rules="[rules.required]"
                prepend-inner-icon="mdi-account"
              ></v-text-field>
  
              <v-text-field
                v-model="formData.email"
                label="Email"
                type="email"
                required
                :rules="[rules.required, rules.email]"
                prepend-inner-icon="mdi-email"
              ></v-text-field>
  
              <v-text-field
                v-model="formData.password"
                label="Senha"
                type="password"
                required
                :rules="[rules.required, rules.password]"
                prepend-inner-icon="mdi-lock"
              ></v-text-field>
  
              <v-text-field
                v-model="formData.phone_number"
                label="Telefone"
                required
                :rules="[rules.required, rules.phone]"
                prepend-inner-icon="mdi-phone"
                mask="(##) #####-####"
              ></v-text-field>
  
              <v-text-field
                v-model="formData.cpf"
                label="CPF"
                required
                :rules="[rules.required, rules.cpf]"
                prepend-inner-icon="mdi-card-account-details"
              ></v-text-field>
  
              <v-divider class="my-4"></v-divider>
              <h3>Endereços</h3>
  
              <div v-for="(address, index) in formData.addresses" :key="index" class="address-section">
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="address.cep"
                      label="CEP"
                      required
                      :rules="[rules.required]"
                      @blur="fetchAddressData(index)"
                      mask="#####-###"
                    ></v-text-field>
                  </v-col>
  
                  <v-col cols="12" sm="6" md="8">
                    <v-text-field
                      v-model="address.logradouro"
                      label="Logradouro"
                      required
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                </v-row>
  
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="address.numero"
                      label="Número"
                      required
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
  
                  <v-col cols="12" sm="6" md="8">
                    <v-text-field
                      v-model="address.complemento"
                      label="Complemento"
                    ></v-text-field>
                  </v-col>
                </v-row>
  
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="address.bairro"
                      label="Bairro"
                      required
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
  
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="address.cidade"
                      label="Cidade"
                      required
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
  
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="address.uf"
                      :items="states"
                      label="Estado"
                      required
                      :rules="[rules.required]"
                    ></v-select>
                  </v-col>
                </v-row>
  
                <v-btn
                  text
                  color="red"
                  @click="removeAddress(index)"
                  v-if="formData.addresses.length > 1"
                >
                  Remover Endereço
                </v-btn>
                <v-divider class="my-4"></v-divider>
              </div>
  
              <v-btn text color="primary" @click="addAddress">
                <v-icon left>mdi-plus</v-icon> Adicionar Endereço
              </v-btn>
  
              <v-btn
                :loading="loading"
                type="submit"
                color="primary"
                block
                class="mt-4"
                style="height: 48px;"
              >
                Criar Conta
              </v-btn>
            </v-form>
          </v-card-text>
  
          <v-snackbar
            v-model="snackbar"
            :color="snackbarColor"
            top
            timeout="3000"
          >
            {{ snackbarMessage }}
            <template v-slot:action="{ attrs }">
              <v-btn text v-bind="attrs" @click="snackbar = false">
                Fechar
              </v-btn>
            </template>
          </v-snackbar>
        </v-card>
      </v-container>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import SimpleNavbar from '@/components/SimpleNavbar.vue';
  
  const router = useRouter();
  
  const baseUrl = import.meta.env.BACKEND_URL || 'http://localhost:8000';
  
  const formData = ref({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    cpf: '',
    addresses: [
      {
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
      },
    ],
  });
  
  const loading = ref(false);
  const snackbar = ref(false);
  const snackbarMessage = ref('');
  const snackbarColor = ref('error');
  
  const registerForm = ref(null);
  
  const states = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  ];
  
  const rules = {
    required: value => !!value || 'Campo obrigatório.',
    email: value => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(value) || 'E-mail inválido.';
    },
    cpf: value => {
      const isValid = validateCPF(value);
      return isValid || 'CPF inválido.';
    },
    phone: value => {
      const pattern = /^\(\d{2}\) \d{5}-\d{4}$/;
      return pattern.test(value) || 'Telefone inválido.';
    },
    password: value => {
      return value.length >= 8 || 'A senha deve ter no mínimo 8 caracteres.';
    },
  };
  
  function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
  
    if (cpf.length !== 11) {
      return false;
    }

    if (/^(\d)\1+$/.test(cpf)) {
      return false;
    }
  
    let sum = 0;
    let remainder;
  
    // First verification digit
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf.charAt(9))) {
      return false;
    }
  
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf.charAt(10))) {
      return false;
    }
  
    return true;
  }
  
  const handleRegister = async () => {
    if (!registerForm.value.validate()) {
      return;
    }
  
    loading.value = true;
    try {
      const payload = {
        ...formData.value,
        cpf: formData.value.cpf.replace(/\D/g, ''),
        phone_number: formData.value.phone_number.replace(/\D/g, ''),
        addresses: formData.value.addresses.map(address => ({
          ...address,
          cep: address.cep.replace(/\D/g, ''),
        })),
      };
  
      await axios.post(`${baseUrl}/user/register/`, payload);
      snackbarMessage.value = 'Conta criada com sucesso!';
      snackbarColor.value = 'success';
      snackbar.value = true;
  
      router.push({ name: 'login' });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      snackbarMessage.value = 'Erro ao criar conta. Verifique os dados e tente novamente.';
      snackbarColor.value = 'error';
      snackbar.value = true;
    } finally {
      loading.value = false;
    }
  };
  
  const addAddress = () => {
    formData.value.addresses.push({
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
    });
  };
  
  const removeAddress = index => {
    formData.value.addresses.splice(index, 1);
  };
  
  const fetchAddressData = async index => {
    const cep = formData.value.addresses[index].cep.replace(/\D/g, '');
    if (cep.length !== 8) {
      return;
    }
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.data.erro) {
        const data = response.data;
        formData.value.addresses[index].logradouro = data.logradouro;
        formData.value.addresses[index].bairro = data.bairro;
        formData.value.addresses[index].cidade = data.localidade;
        formData.value.addresses[index].uf = data.uf;
      } else {
        snackbarMessage.value = 'CEP não encontrado.';
        snackbarColor.value = 'error';
        snackbar.value = true;
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      snackbarMessage.value = 'Erro ao buscar CEP.';
      snackbarColor.value = 'error';
      snackbar.value = true;
    }
  };
  </script>
  
  <style scoped>
  .register-container {
    background-color: #f3f1f0;
    min-height: 100vh;
  }
  
  .fill-height {
    min-height: calc(100vh - 64px); /* Adjust based on your Navbar height */
  }
  
  .address-section {
    margin-bottom: 20px;
  }
  
  .text-center {
    text-align: center;
  }
  
  .my-4 {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
  </style>
  