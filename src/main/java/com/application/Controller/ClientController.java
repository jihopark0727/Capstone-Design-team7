package com.application.Controller;

import com.application.Dto.ResponseDto;
import com.application.Entity.Client;
import com.application.Service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    @Autowired
    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    // 모든 내담자 조회
    @GetMapping
    public ResponseDto<List<Client>> getAllClients() {
        return clientService.getAllClients();
    }

    // 특정 내담자 조회
    @GetMapping("/{id}")
    public ResponseDto<Client> getClientById(@PathVariable Long id) {
        return clientService.getClientById(id);
    }

    // 내담자 추가
    @PostMapping
    public ResponseDto<Client> addClient(@RequestBody Client client) {
        return clientService.addClient(client);
    }

    // 내담자 정보 수정
    @PutMapping("/{id}")
    public ResponseDto<Client> updateClient(@PathVariable Long id, @RequestBody Client client) {
        return clientService.updateClient(id, client);
    }

    // 내담자 삭제
    @DeleteMapping("/{id}")
    public ResponseDto<?> deleteClient(@PathVariable Long id) {
        return clientService.deleteClient(id);
    }
}
