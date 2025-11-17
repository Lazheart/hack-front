import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, Divider, TextField, MenuItem, InputAdornment, IconButton, Button, FormControl, InputLabel, Select, type SelectChangeEvent, Tooltip, Snackbar, Alert, Stack, Typography } from '@mui/material'
import { Email, Lock, PersonAdd, Business, Save, Refresh } from '@mui/icons-material'
import useAuth from '../../services/auth/useAuth'
import { registerApi } from '../../services/auth/authApi'

const defaultDepartments = ['IT', 'Operaciones', 'Soporte', 'Recursos Humanos', 'Finanzas']

const AdminRegisterWorker = () => {
  const { user } = useAuth()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [department, setDepartment] = useState('')
  const [customDepartment, setCustomDepartment] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    const dep = department === 'Otro' ? customDepartment.trim() : department.trim()
    return email.trim() && username.trim() && password.trim().length >= 6 && dep.length > 0
  }, [email, username, password, department, customDepartment])

  if (!user || (user.role ?? '').toLowerCase() !== 'admin') {
    return (
      <Card elevation={0} sx={{ border: '1px solid #e5e7eb' }}>
        <CardHeader title="Acceso restringido" subheader="Solo administradores pueden registrar trabajadores" />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Tu rol actual no tiene permisos para acceder a este módulo.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      setSuccessMsg(null)
      setErrorMsg(null)

      const depValue = department === 'Otro' ? customDepartment.trim() : department

      const res = await registerApi({
        email: email.trim(),
        username: username.trim(),
        password: password,
        role: 'Worker',
        department: depValue,
      })

      setSuccessMsg(`Trabajador registrado. ID: ${res.userId}`)
      // reset form quickly
      setEmail('')
      setUsername('')
      setPassword('')
      setDepartment('')
      setCustomDepartment('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setErrorMsg(msg || 'Error registrando trabajador')
    } finally {
      setLoading(false)
    }
  }

  const onChangeDepartment = (e: SelectChangeEvent) => {
    setDepartment(e.target.value)
    if (e.target.value !== 'Otro') setCustomDepartment('')
  }

  return (
    <Card sx={{ overflow: 'hidden', position: 'relative' }}>
      <CardHeader
        avatar={<PersonAdd color="primary" />}
        title="Registrar trabajador"
        subheader="Crea cuentas de trabajador y asígnalas a un departamento"
      />
      <Divider />
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Correo"
            placeholder="persona@empresa.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Usuario"
            placeholder="nombre.usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Mínimo 6 caracteres"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth>
            <InputLabel id="dep-label">Departamento</InputLabel>
            <Select
              labelId="dep-label"
              label="Departamento"
              value={department}
              onChange={onChangeDepartment}
              startAdornment={
                <InputAdornment position="start" sx={{ pl: 1 }}>
                  <Business fontSize="small" />
                </InputAdornment>
              }
            >
              {defaultDepartments.map((d) => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
              ))}
              <MenuItem value="Otro">Otro…</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {department === 'Otro' && (
          <TextField
            sx={{ mt: 2 }}
            label="Departamento personalizado"
            placeholder="Ingresa el nombre del departamento"
            value={customDepartment}
            onChange={(e) => setCustomDepartment(e.target.value)}
            fullWidth
          />
        )}

        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
          <Tooltip title="Limpiar formulario">
            <span>
              <IconButton onClick={() => { setEmail(''); setUsername(''); setPassword(''); setDepartment(''); setCustomDepartment('') }} disabled={loading}>
                <Refresh />
              </IconButton>
            </span>
          </Tooltip>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            disabled={!canSubmit || loading}
            onClick={onSubmit}
            sx={{
              transition: 'transform 120ms ease, box-shadow 200ms ease',
              '&:hover': { transform: 'translateY(-1px)' },
            }}
          >
            Registrar trabajador
          </Button>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
          Este registro usa el endpoint /register con rol=Worker y departamento seleccionado.
        </Typography>
      </CardContent>

      <Snackbar open={!!successMsg} autoHideDuration={3000} onClose={() => setSuccessMsg(null)}>
        <Alert onClose={() => setSuccessMsg(null)} severity="success" variant="filled" sx={{ width: '100%' }}>
          {successMsg}
        </Alert>
      </Snackbar>

      <Snackbar open={!!errorMsg} autoHideDuration={4000} onClose={() => setErrorMsg(null)}>
        <Alert onClose={() => setErrorMsg(null)} severity="error" variant="filled" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Card>
  )
}

export default AdminRegisterWorker
