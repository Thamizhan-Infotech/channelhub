# 📘 ChannelHub — API Integration Guide
### *A Complete, Step-by-Step Walkthrough Using the Login API*

---

## 🧭 Before You Begin

This guide will walk you through **exactly** how to connect a new API endpoint to the app. We'll use the **Login API** as our real example — because it already exists in the project and you can see every file we talk about.

By the end, you'll know how to:
- Understand what each file does and why it exists
- Add a new API in the exact same way
- Avoid the most common mistakes

---

## 🏗️ The 5-Layer System (How Data Flows)

Think of it like a pipeline. Data flows from the **Server** → through 5 layers → to the **User's Screen**.

```
Server (Internet)
    ↓
[1] Service Layer       → Just makes the HTTP call
    ↓
[2] Repository Layer    → Parses data, handles tokens, runs logic
    ↓
[3] Cubit (State)       → Tracks: Loading? Success? Error?
    ↓
[4] State Object        → Holds the current data snapshot
    ↓
[5] UI Screen           → Shows the result to the user
```

Each layer has **one job only**. Never skip a layer or mix responsibilities.

---

## 📂 File Locations (Where Everything Lives)

| Layer | File Path |
|:---|:---|
| Model | [lib/data/models/auth_models.dart](file:///Users/mreagle/workspace/freelance/channelhub/lib/data/models/auth_models.dart) |
| Service | [lib/data/services/auth_service.dart](file:///Users/mreagle/workspace/freelance/channelhub/lib/data/services/auth_service.dart) |
| Repository | [lib/data/repositories/auth_repository.dart](file:///Users/mreagle/workspace/freelance/channelhub/lib/data/repositories/auth_repository.dart) |
| State | [lib/features/login/logic/login_state.dart](file:///Users/mreagle/workspace/freelance/channelhub/lib/features/login/logic/login_state.dart) |
| Cubit | [lib/features/login/logic/login_cubit.dart](file:///Users/mreagle/workspace/freelance/channelhub/lib/features/login/logic/login_cubit.dart) |
| Screen | [lib/features/login/login_screen.dart](file:///Users/mreagle/workspace/freelance/channelhub/lib/features/login/login_screen.dart) |

---

## 🔵 Layer 1: The Model ([auth_models.dart](file:///Users/mreagle/workspace/freelance/channelhub/lib/data/models/auth_models.dart))

### What is it?
A **Model** is a Dart class that describes the shape of data. It's like a form template — it defines what fields exist and what type they are.

### Why do we need it?
The server sends raw text (JSON) like this:
```json
{
  "username": "john@example.com",
  "password": "secret123"
}
```
Flutter doesn't understand raw JSON. The Model translates it into a real Dart object the app can use.

### The Login Request Model
This is what we **send** to the server when the user taps "Sign In":

```dart
// lib/data/models/auth_models.dart

class LoginRequest {
  const LoginRequest({required this.username, required this.password});

  final String username;  // The user's email address
  final String password;  // The user's password

  // toJson() converts this object back into a Map (raw data)
  // so Dio can send it to the server
  Map<String, dynamic> toJson() => {
    'username': username,
    'password': password,
  };
}
```

> 💡 **Key Rule**: If you're **sending** data to the server, you need [toJson()](file:///Users/mreagle/workspace/freelance/channelhub/lib/data/models/auth_models.dart#90-91).
> If you're **receiving** data from the server, you need `fromJson()`.

---

## 🔵 Layer 2: The Service ([auth_service.dart](file:///Users/mreagle/workspace/freelance/channelhub/lib/data/services/auth_service.dart))

### What is it?
The Service is the **only place** in the entire app that knows the API URL. It uses **Dio** (our HTTP library) to make the actual network call.

### Why do we need it?
Keeping URLs in one place means if the server address changes, you only update it in one file — not 20 different places.

### The Login Service Method

```dart
// lib/data/services/auth_service.dart

class AuthService {
  AuthService(this._dio);   // Dio is injected — don't create it yourself
  final Dio _dio;

  // This method sends a POST request to /auth/login
  // It takes a username and password and returns a raw Response
  Future<Response> login({required String username, required String password}) {
    return _dio.post(
      '/auth/login',                          // ← The API endpoint path
      data: {'username': username, 'password': password},  // ← The body
    );
  }
}
```

> ⚠️ **Important**: The Service returns a raw [Response](file:///Users/mreagle/workspace/freelance/channelhub/lib/data/models/auth_models.dart#14-27). It does NOT parse the data. That's the Repository's job.

---

## 🔵 Layer 3: The Repository ([auth_repository.dart](file:///Users/mreagle/workspace/freelance/channelhub/lib/data/repositories/auth_repository.dart))

### What is it?
The Repository is the **brain**. It calls the Service, parses the response into a Model, and handles any side effects (like saving the user's token so they stay logged in).

### Why do we need it?
The Cubit (UI logic) should not know anything about HTTP calls or JSON parsing. The Repository acts as a clean middleman.

### The Login Repository Method

```dart
// lib/data/repositories/auth_repository.dart

class AuthRepository {
  AuthRepository(this._authService, this._userService);

  final AuthService _authService;
  final UserService _userService;

  Future<User?> login(String email, String password) async {
    try {
      // STEP 1: Call the Service to make the network request
      final response = await _authService.login(
        username: email,
        password: "$password-user",  // Note: project appends "-user" to password
      );

      // STEP 2: Parse the raw JSON response into our UserModel
      final userModel = UserModel.fromJson(response.data);

      // STEP 3: Save the JWT token so future requests are authenticated
      if (userModel.token != null) {
        await ApiClient.setToken(userModel.token!);
      }

      // STEP 4: Save the user object in memory for the app to use
      if (userModel.user != null) {
        _userService.setCurrentUser(userModel.user);
      }

      // STEP 5: Return the User object to whoever called this method
      return userModel.user;

    } catch (e) {
      // If anything goes wrong, pass the error up to the Cubit
      rethrow;
    }
  }
}
```

> 💡 **Key Rule**: Always use `try/catch` and `rethrow` in the Repository. This lets the Cubit decide how to show the error to the user.

---

## 🔵 Layer 4a: The State ([login_state.dart](file:///Users/mreagle/workspace/freelance/channelhub/lib/features/login/logic/login_state.dart))

### What is it?
The State is a **snapshot** of the screen at any given moment. It holds all the data the screen needs to display.

### Why do we need it?
Instead of using many separate variables, we keep everything in one place. When something changes, we create a new State object with the updated values.

```dart
// lib/features/login/logic/login_state.dart

class LoginState extends Equatable {
  const LoginState({
    this.email = '',        // What the user typed in the email field
    this.password = '',     // What the user typed in the password field
    this.loading = false,   // Is the app waiting for the server? (shows spinner)
    this.success = false,   // Did login succeed? (triggers navigation)
    this.error,             // Error message to show (null = no error)
    this.user,              // The logged-in user object (null = not logged in)
  });

  final String email;
  final String password;
  final bool loading;
  final bool success;
  final String? error;
  final User? user;

  // copyWith() creates a NEW state with only the changed fields updated
  // This is how we "update" the state — we never mutate the old one
  LoginState copyWith({
    String? email,
    String? password,
    bool? loading,
    bool? success,
    String? error,
    User? user,
  }) {
    return LoginState(
      email: email ?? this.email,
      password: password ?? this.password,
      loading: loading ?? this.loading,
      success: success ?? this.success,
      error: error,   // Note: error is NOT using ?? so it can be reset to null
      user: user,
    );
  }

  @override
  List<Object?> get props => [email, password, loading, success, error, user];
}
```

---

## 🔵 Layer 4b: The Cubit ([login_cubit.dart](file:///Users/mreagle/workspace/freelance/channelhub/lib/features/login/logic/login_cubit.dart))

### What is it?
The Cubit is the **controller**. It receives actions from the UI (like "user tapped Sign In"), calls the Repository, and emits new States.

### Why do we need it?
It keeps all the business logic out of the UI file. The screen just says "login please" and the Cubit handles everything else.

```dart
// lib/features/login/logic/login_cubit.dart

class LoginCubit extends Cubit<LoginState> {
  LoginCubit(this._authRepository) : super(const LoginState());

  final AuthRepository _authRepository;

  // Called every time the user types in the email field
  void updateEmail(String email) {
    emit(state.copyWith(email: email, error: null));
  }

  // Called every time the user types in the password field
  void updatePassword(String password) {
    emit(state.copyWith(password: password, error: null));
  }

  // Called when the user taps the "Sign In" button
  Future<void> login() async {
    // Guard: Don't proceed if fields are empty
    if (state.email.isEmpty || state.password.isEmpty) {
      emit(state.copyWith(error: 'Please fill all fields'));
      return;
    }

    // 1. Tell the UI: "We are loading, show a spinner"
    emit(state.copyWith(loading: true, error: null));

    try {
      // 2. Ask the Repository to do the actual work
      final User? user = await _authRepository.login(
        state.email,
        state.password,
      );

      // 3. Success! Tell the UI to navigate to the Dashboard
      emit(state.copyWith(loading: false, success: true, user: user));

    } on DioException catch (e) {
      // 4a. Handle network-specific errors with clear messages
      String errorMessage = 'Login failed. Please try again.';

      if (e.response?.statusCode == 500) {
        errorMessage = 'Invalid credentials. Check your email and password.';
      } else if (e.response?.data is Map<String, dynamic>) {
        final data = e.response!.data as Map<String, dynamic>;
        errorMessage = data['message'] ?? data['error'] ?? errorMessage;
      }

      emit(state.copyWith(loading: false, error: errorMessage));

    } catch (e) {
      // 4b. Handle any other unexpected errors
      emit(state.copyWith(
        loading: false,
        error: 'An unexpected error occurred. Please try again.',
      ));
    }
  }
}
```

---

## 🔵 Layer 5: The UI Screen ([login_screen.dart](file:///Users/mreagle/workspace/freelance/channelhub/lib/features/login/login_screen.dart))

### What is it?
The Screen is what the user **sees and interacts with**. It reads from the State and sends actions to the Cubit.

### The Two Key Widgets

**`BlocConsumer`** — Used when you need BOTH:
- `listener`: React to one-time events (navigate, show a dialog)
- `builder`: Rebuild the UI when state changes

```dart
// lib/features/login/login_screen.dart

BlocConsumer<LoginCubit, LoginState>(
  // LISTENER: Runs once when state changes — used for navigation & dialogs
  listener: (context, state) {
    // If login succeeded → go to Dashboard
    if (state.success) {
      Navigator.pushReplacementNamed(context, Routes.dashboard);
    }
    // If there's an error → show a popup dialog
    if (state.error != null) {
      showCupertinoDialog(
        context: context,
        builder: (_) => CupertinoAlertDialog(
          title: const Text('Error'),
          content: Text(state.error!),
          actions: [
            CupertinoDialogAction(
              child: const Text('OK'),
              onPressed: () => Navigator.pop(context),
            ),
          ],
        ),
      );
    }
  },

  // BUILDER: Rebuilds the UI every time state changes
  builder: (context, state) {
    return Column(
      children: [
        // Email field — sends updates to Cubit as user types
        AppTextField(
          controller: _emailController,
          label: 'Email',
          enabled: !state.loading,  // ← Disabled while loading
          onChanged: (value) => context.read<LoginCubit>().updateEmail(value),
        ),

        // Password field
        AppTextField(
          controller: _passwordController,
          label: 'Password',
          enabled: !state.loading,
          onChanged: (value) => context.read<LoginCubit>().updatePassword(value),
        ),

        // Sign In button — triggers the login() method in Cubit
        AppButton.text(
          text: 'Sign in',
          isLoading: state.loading,  // ← Shows spinner when loading
          onPressed: () {
            context.read<LoginCubit>().login();  // ← This starts the whole chain!
          },
        ),
      ],
    );
  },
)
```

---

## 🔄 The Complete Flow (End to End)

Here's what happens when a user taps "Sign In":

```
User taps "Sign In" button
    ↓
LoginScreen calls: context.read<LoginCubit>().login()
    ↓
LoginCubit emits: state.copyWith(loading: true)
    ↓
LoginScreen rebuilds: shows spinner on button
    ↓
LoginCubit calls: _authRepository.login(email, password)
    ↓
AuthRepository calls: _authService.login(username, password)
    ↓
AuthService sends: POST /auth/login { username, password }
    ↓
Server responds with: { token: "...", user: { id, name, ... } }
    ↓
AuthRepository parses: UserModel.fromJson(response.data)
AuthRepository saves: ApiClient.setToken(token)
AuthRepository returns: User object
    ↓
LoginCubit emits: state.copyWith(loading: false, success: true, user: user)
    ↓
LoginScreen listener: Navigator.pushReplacementNamed(context, Routes.dashboard)
    ↓
User sees the Dashboard! ✅
```

---

## ✅ Checklist: Adding a New API

Use this every time you add a new feature:

- [ ] **1. Model** — Create a class in `lib/data/models/` with `fromJson()` and/or `toJson()`
- [ ] **2. Service** — Add a method in `lib/data/services/` using `_dio.get()` or `_dio.post()`
- [ ] **3. Repository** — Add a method in `lib/data/repositories/` that calls the service and parses the result
- [ ] **4. State** — Add any new fields to the State class and update `copyWith()` and `props`
- [ ] **5. Cubit** — Add a method that emits Loading → calls Repository → emits Success or Error
- [ ] **6. Screen** — Use `BlocBuilder` or `BlocConsumer` to show the result

---

## ⚠️ Common Mistakes to Avoid

| Mistake | Why It's Wrong | Fix |
|:---|:---|:---|
| Calling `_dio` directly in the Cubit | Mixes network logic with UI logic | Always go through Service → Repository |
| Forgetting `try/catch` in Repository | App will crash on network errors | Always wrap in `try { } catch (e) { rethrow; }` |
| Not emitting `loading: false` on error | Spinner never stops | Always set `loading: false` in both success AND error paths |
| Using `context` after `await` without checking `mounted` | Can crash if user navigates away | Capture cubit before async: `final cubit = context.read<MyCubit>()` |
| Typo in the URL path | 404 error, no data | Double-check the exact path with the backend team |

---

*This guide covers the complete Login API integration. Follow the same pattern for every new API you add to the project.*
